import { Controller, Get, Post, Body, UseGuards, Req, UseInterceptors, UploadedFile, Delete, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MarketsService } from './markets.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { uploadImageToImgBB } from '../common/helpers/image-upload.helper';

@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) { }

  @Get()
  async findAll() {
    return await this.marketsService.findAll();
  }

  @Get('get')
  @UseGuards(JwtAuthGuard)
  async getMyMarkets(@Req() req) {
    return await this.marketsService.findByUser(req.user.email);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() body: { title: string; lat: string | number; lng: string | number },
    @UploadedFile() file: { buffer: Buffer; originalname: string },
    @Req() req,
  ) {
    const logoUrl = await uploadImageToImgBB(file);

    return await this.marketsService.create(
      {
        title: body.title,
        logo: logoUrl,
        lat: Number(body.lat),
        lng: Number(body.lng)
      },
      req.user.email
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req) {
    return await this.marketsService.remove(id, req.user.email);
  }
}