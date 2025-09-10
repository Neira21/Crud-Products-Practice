import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

// Para manejar archivos, borrar archivos
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World! from NestJS Products Service';
  }

  async create(createProductDto: CreateProductDto) {
    const data = {
      name: createProductDto.name,
      description: createProductDto.description || '',
      price: createProductDto.price ? Number(createProductDto.price) : 0,
      imageUrl: createProductDto.imageUrl || '',
    };
    return await this.prisma.product.create({ data });
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async patchUpdate(id: number, updateProductDto: UpdateProductDto) {
    // 1. Obtener el producto actual para verificar si tiene imagen anterior
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // 2. Si se está actualizando la imagen, eliminar la imagen anterior
    if (
      updateProductDto.imageUrl &&
      existingProduct.imageUrl &&
      existingProduct.imageUrl !== updateProductDto.imageUrl &&
      existingProduct.imageUrl.startsWith('/uploads/')
    ) {
      try {
        const oldFilePath = join('.', existingProduct.imageUrl);
        await fs.unlink(oldFilePath);
        console.log(`Imagen anterior eliminada: ${oldFilePath}`);
      } catch (fileError) {
        console.warn(
          `No se pudo eliminar la imagen anterior: ${existingProduct.imageUrl}`,
          fileError,
        );
      }
    }

    // 3. Actualizar el producto
    if (updateProductDto.description === undefined) {
      updateProductDto.description = '';
    }

    const data = { ...updateProductDto };

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async putUpdate(id: number, updateProductDto: UpdateProductDto) {
    console.log('PUT - UpdateProductDto:, service', updateProductDto);
    if (updateProductDto.description === undefined) {
      updateProductDto.description = '';
    }
    if (updateProductDto.price === undefined) {
      updateProductDto.price = 0;
    }
    const data = { ...updateProductDto, price: Number(updateProductDto.price) };
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    try {
      // 1. Obtener el producto antes de eliminarlo para conseguir la imageUrl
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      // 2. Eliminar el producto de la base de datos
      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });

      // 3. Eliminar la imagen física si existe
      if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
        try {
          // Convertir URL a ruta física: /uploads/products/file.jpg → ./uploads/products/file.jpg
          const filePath = join('.', product.imageUrl);
          await fs.unlink(filePath);
          console.log(`Imagen eliminada: ${filePath}`);
        } catch (fileError) {
          console.warn(
            `No se pudo eliminar la imagen: ${product.imageUrl}`,
            fileError,
          );
          // No lanzar error aquí, el producto ya se eliminó de la BD
        }
      }

      return deletedProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('No se puede eliminar el producto');
    }
  }

  async removeRange(from: number, to: number) {
    // Validar que el rango sea válido
    if (from > to) {
      throw new BadRequestException(
        'El valor de "from" debe ser menor al valor de "to"',
      );
    }

    if (from < 1 || to < 1) {
      throw new BadRequestException('Los IDs deben ser números positivos');
    }

    try {
      // 1. Obtener todos los productos en el rango para conseguir las imageUrls
      const productsToDelete = await this.prisma.product.findMany({
        where: {
          id: {
            gte: from, // greater than or equal (>=)
            lte: to, // less than or equal (<=)
          },
        },
        select: { id: true, imageUrl: true },
      });

      if (productsToDelete.length === 0) {
        throw new NotFoundException(
          `No se encontraron productos en el rango ${from}-${to}`,
        );
      }

      console.log(
        `Encontrados ${productsToDelete.length} productos para eliminar`,
      );

      // 2. Eliminar los productos de la base de datos
      const deleteResult = await this.prisma.product.deleteMany({
        where: {
          id: {
            gte: from,
            lte: to,
          },
        },
      });

      // 3. Eliminar las imágenes físicas
      const deletedImages: string[] = [];
      const failedImages: string[] = [];

      for (const product of productsToDelete) {
        if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
          try {
            const filePath = join('.', product.imageUrl);
            await fs.unlink(filePath);
            deletedImages.push(product.imageUrl);
            console.log(`Imagen eliminada: ${filePath}`);
          } catch (fileError) {
            failedImages.push(product.imageUrl);
            console.warn(
              `No se pudo eliminar la imagen: ${product.imageUrl}`,
              fileError,
            );
          }
        }
      }

      return {
        message: `Eliminados ${deleteResult.count} productos (IDs ${from}-${to})`,
        deletedCount: deleteResult.count,
        deletedImages: deletedImages.length,
        failedImages: failedImages.length,
        details: {
          productsDeleted: productsToDelete.map((p) => p.id),
          imagesDeleted: deletedImages,
          imagesFailed: failedImages,
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new NotFoundException('Error al eliminar el rango de productos');
    }
  }
}
