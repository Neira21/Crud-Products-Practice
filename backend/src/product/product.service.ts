import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

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
      imageUrl: createProductDto.imageUrl || null,
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
      return await this.prisma.product.delete({ where: { id } });
    } catch {
      throw new NotFoundException('No se puede eliminar el producto');
    }
  }
}
