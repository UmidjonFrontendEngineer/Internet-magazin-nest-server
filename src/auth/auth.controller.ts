import { Controller, Post, Patch, Get, Delete, Body, Headers, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() dto: any) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: any) {
    return this.authService.login(dto);
  }

  @Get('profile')
  async getProfile(@Headers('authorization') authHeader: string) {
    if (!authHeader) throw new UnauthorizedException('Token topilmadi');
    const token = authHeader.split(' ')[1];
    return this.authService.getProfile(token);
  }

  @Patch('update-profile')
  async updateProfile(@Headers('authorization') authHeader: string, @Body() dto: any) {
    if (!authHeader) throw new UnauthorizedException('Token topilmadi');
    const token = authHeader.split(' ')[1];
    return this.authService.updateProfile(token, dto);
  }

  @Delete('account')
  async deleteAccount(@Headers('authorization') authHeader: string) {
    if (!authHeader) throw new UnauthorizedException('Token topilmadi');
    const token = authHeader.split(' ')[1];
    return this.authService.deleteAccount(token);
  }

  @Patch('image-update')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Headers('authorization') authHeader: string,
    @UploadedFile() file: any,
  ) {
    if (!authHeader) throw new UnauthorizedException('Token topilmadi');
    const token = authHeader.split(' ')[1];

    return this.authService.updateUserImage(token, file);
  }
}