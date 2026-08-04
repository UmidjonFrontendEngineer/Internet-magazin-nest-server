import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { Pool } from 'pg';
import axios from 'axios';
import { uploadImageToImgBB } from '../common/helpers/image-upload.helper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
    @Inject('DATABASE_POOL') private pool: Pool
  ) { }

  async sendOtp(dto: { email: string }) {
      console.log("dto:", dto);

      if (!dto || !dto.email) {
        console.log("Email topilmadi!");
        throw new BadRequestException('Email kiritilishi shart!');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dto.email)) {
        throw new BadRequestException('Noto‘g‘ri email formati kiritildi!');
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const hashedOtp = await bcrypt.hash(otpCode, 10);

      let userResult = await this.db.query(
        'SELECT * FROM "Users" WHERE email = $1',
        [dto.email],
      );

      if (userResult.rows.length === 0) {
        const defaultUserName = 'user_' + Math.random().toString(36).substring(2, 8);
        await this.db.query(
          `INSERT INTO "Users" (email, "userName", image) VALUES ($1, $2, $3)`,
          [dto.email, defaultUserName, 'https://i.ibb.co/nNZrjBSD/user.png'],
        );
      }

      await this.db.query(
        `UPDATE "Users" SET "otpCode" = $1, "otpExpires" = $2 WHERE email = $3`,
        [hashedOtp, expiresAt, dto.email],
      );

      try {
        const nextJsUrl = 'https://internet-magazin-panel.vercel.app/api/send-mail';
        console.log("so'rov yuborilmoqda...", nextJsUrl);

        const response = await axios.post(
          nextJsUrl,
          {
            email: dto.email,
            otp: otpCode,
          },
          {
            headers: {
              'x-api-key': process.env.INTERNAL_API_KEY,
            },
          },
        );

        console.log("4. Next.js javobi:", response.data);

      } catch (error: any) {
        console.error('5. Axios / Next.js xatoligi:', error.response?.data || error.message);
        throw new BadRequestException('Emailga xat yuborib bo\'lmadi. Next.js serverini tekshiring!');
      }

      return {
        message: 'Tasdiqlash kodi emailingizga yuborildi!',
      };
  }

  async verifyOtp(dto: { email: string; code: string }) {
      const result = await this.db.query(
        'SELECT * FROM "Users" WHERE email = $1',
        [dto.email],
      );

      const user = result.rows[0];

      if (!user || !user.otpCode) {
        throw new UnauthorizedException('Tasdiqlash kodi xato!');
      }

      const isMatch = await bcrypt.compare(dto.code, user.otpCode);
      if (!isMatch) {
        throw new UnauthorizedException('Tasdiqlash kodi xato!');
      }

      if (new Date() > new Date(user.otpExpires)) {
        throw new UnauthorizedException('Tasdiqlash kodining muddati tugagan!');
      }

      await this.db.query(
        `UPDATE "Users" SET "otpCode" = NULL, "otpExpires" = NULL WHERE id = $1`,
        [user.id],
      );

      const token = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
          userName: user.userName || user.email.split('@')[0]
        },
        { secret: 'SUPER_SECRET_KEY_123' },
      );

      delete user.otpCode;
      delete user.otpExpires;

      return {
        message: 'Xush kelibsiz!',
        token,
        user,
      };
    }

  async getProfile(token: string) {
    try {
      const decoded = this.jwtService.verify(token, { secret: 'SUPER_SECRET_KEY_123' });
      const result = await this.db.query(
        'SELECT id, "userName", "firstName", "lastName", email, phone, gender, image, bio, "createdAt" FROM "Users" WHERE id = $1',
        [decoded.sub],
      );

      if (!result.rows[0]) {
        throw new UnauthorizedException('Foydalanuvchi topilmadi');
      }

      return result.rows[0];
    } catch (err) {
      throw new UnauthorizedException('Token yaroqsiz yoki eskirgan');
    }
  }

  async updateProfile(token: string, dto: any) {
    try {
      const decoded = this.jwtService.verify(token, { secret: 'SUPER_SECRET_KEY_123' });

      const result = await this.db.query(
        `UPDATE "Users" 
         SET "userName" = COALESCE(NULLIF($1, ''), "userName"),
             "firstName" = $2, 
             "lastName" = $3, 
             "phone" = $4, 
             "gender" = $5, 
             "bio" = $6,
             "image" = COALESCE(NULLIF($7, ''), "image") 
         WHERE id = $8 
         RETURNING id, "userName", "firstName", "lastName", email, phone, gender, bio, image, "createdAt"`,
        [
          dto.userName,
          dto.firstName,
          dto.lastName,
          dto.phone,
          dto.gender,
          dto.bio,
          dto.image || null,
          decoded.sub,
        ],
      );

      return {
        message: 'Profil muvaffaqiyatli yangilandi!',
        user: result.rows[0],
      };
    } catch (err) {
      throw new UnauthorizedException('Token yaroqsiz yoki userName band bo\'lishi mumkin');
    }
  }

  async deleteAccount(token: string) {
    try {
      const decoded = this.jwtService.verify(token, { secret: 'SUPER_SECRET_KEY_123' });
      await this.db.query('DELETE FROM "Users" WHERE id = $1', [decoded.sub]);
      return { message: 'Hisob muvaffaqiyatli o\'chirildi' };
    } catch (err) {
      throw new UnauthorizedException('Token yaroqsiz yoki amal qilish muddati tugagan');
    }
  }

  async updateImage(createShopDto: { image: string }, email: string) {
    const { image } = createShopDto;

    const result = await this.pool.query(
      'UPDATE "Users" SET image = $1 WHERE email = $2 RETURNING *',
      [image, email],
    );

    return result.rows[0];
  }
}