import { Controller, Post, Get, UseGuards, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async createProduct(@Req() req, @UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.productsService.createProduct(req.body, files, req.user);
  }
}