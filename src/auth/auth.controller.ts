import { Controller, Post, Patch, Get, Delete, Body, Headers, UnauthorizedException, UseGuards, Req, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { uploadImageToImgBB } from '../common/helpers/image-upload.helper';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('send-otp')
    async sendOtp(@Body() dto: { email: string }) {
        return this.authService.sendOtp(dto);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() dto: { email: string; code: string }) {
        return this.authService.verifyOtp(dto);
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

    @Patch('image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async updateImage(
        @UploadedFile() file: { buffer: Buffer; originalname: string },
        @Req() req,
    ) {
        if (!file) {
            throw new BadRequestException('Yuklash uchun rasm topilmadi!');
        }

        const imageUrl = await uploadImageToImgBB(file);

        return await this.authService.updateImage(
            { image: imageUrl },
            req.user.email
        );
    }
}