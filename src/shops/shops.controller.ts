import { Controller, Get, Post, Body, UseGuards, Req, UseInterceptors, UploadedFile, Delete, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './shops.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { uploadImageToImgBB } from '../common/helpers/image-upload.helper';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) { }

  @Get()
  async findAll() {
    return await this.shopsService.findAll();
  }

  @Get('get')
  @UseGuards(JwtAuthGuard)
  async getMyShops(@Req() req) {
    return await this.shopsService.findByUser(req.user.email);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() body: { title: string },
    @UploadedFile() file: { buffer: Buffer; originalname: string },
    @Req() req,
  ) {
    const logoUrl = await uploadImageToImgBB(file);

    return await this.shopsService.create(
      { title: body.title, logo: logoUrl },
      req.user.email
    );
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req) {
    return await this.shopsService.remove(id, req.user.email);
  }
}