import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/hello')
  getHello(): string {
    console.log('GET /products/hello called');
    return this.productService.getHello();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const random = Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname) || '.bin';
          const filename = `product-${timestamp}-${random}${extension}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file) {
          cb(null, true);
          return;
        }
        // Permitir imágenes y audio
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|mp3|wav|ogg|m4a)$/)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Solo se permiten archivos de imagen (jpg, jpeg, png, gif) o audio (mp3, wav, ogg, m4a)',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('Raw body:', createProductDto);
    console.log('File received:', file);

    // Priorizar archivo subido sobre imageUrl del body
    if (file) {
      // Usar el filename que multer ya generó
      createProductDto.imageUrl = `/uploads/products/${file.filename}`;
    }
    // Si no hay archivo pero viene imageUrl en el body, se mantiene

    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const random = Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname) || '.bin';
          const filename = `product-${timestamp}-${random}${extension}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file) {
          cb(null, true);
          return;
        }
        // Permitir imágenes y audio
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|mp3|wav|ogg|m4a)$/)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Solo se permiten archivos de imagen (jpg, jpeg, png, gif) o audio (mp3, wav, ogg, m4a)',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('PATCH - Body:', updateProductDto);
    console.log('PATCH - File:', file);

    // Si hay archivo nuevo, agregar la nueva URL
    if (file) {
      updateProductDto.imageUrl = `/uploads/products/${file.filename}`;
    }

    return this.productService.patchUpdate(id, updateProductDto);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const random = Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname) || '.bin';
          const filename = `product-${timestamp}-${random}${extension}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file) {
          cb(null, true);
          return;
        }
        // Permitir imágenes y audio
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|mp3|wav|ogg|m4a)$/)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Solo se permiten archivos de imagen (jpg, jpeg, png, gif) o audio (mp3, wav, ogg, m4a)',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  Update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Si hay archivo nuevo, agregar la nueva URL
    if (file) {
      updateProductDto.imageUrl = `/uploads/products/${file.filename}`;
    }

    console.log('desde controller, updateProductDto:', updateProductDto);
    return this.productService.putUpdate(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  @Delete('range/:from/:to')
  removeRange(
    @Param('from', ParseIntPipe) from: number,
    @Param('to', ParseIntPipe) to: number,
  ) {
    console.log(`Eliminando productos del ID ${from} al ${to}`);
    return this.productService.removeRange(from, to);
  }
}
