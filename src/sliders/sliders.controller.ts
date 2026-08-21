import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req,
  UploadedFile, UseInterceptors, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { uploadImageToImgBB } from '../common/helpers/image-upload.helper';

@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) { }

  @Get()
  async findAll() {
    return await this.slidersService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createSliderDto: CreateSliderDto,
    @UploadedFile() file: { buffer: Buffer; originalname: string },
    @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException("Rasm yuklanishi shart!");
    }
    const imageUrl = await uploadImageToImgBB(file);
    const userEmail = req.user.email;

    return await this.slidersService.create(
      { ...createSliderDto, image: imageUrl },
      userEmail
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateSliderDto: UpdateSliderDto,
    @UploadedFile() file: { buffer: Buffer; originalname: string },
    @Req() req,
  ) {
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await uploadImageToImgBB(file);
    }

    const userEmail = req.user.email;
    return await this.slidersService.update(
      id,
      { ...updateSliderDto, ...(imageUrl && { image: imageUrl }) },
      userEmail
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req) {
    const userEmail = req.user.email;
    return await this.slidersService.remove(id, userEmail);
  }
}