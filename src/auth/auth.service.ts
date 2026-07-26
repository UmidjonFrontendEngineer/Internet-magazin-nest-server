import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) { }

  async sendOtp(dto: { email: string }) {
    if (!dto.email) {
      throw new BadRequestException('Email kiritilishi shart!');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

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
      [otpCode, expiresAt, dto.email],
    );

    try {
      await this.transporter.sendMail({
        from: '"Online Market" <umidjonsharipov283@gmail.com>',
        to: dto.email,
        subject: 'Online Market - Tasdiqlash kodi',
        text: `Sizning tasdiqlash kodingiz: ${otpCode}. Kod 10 daqiqa davomida amal qiladi.`,
      });
    } catch (error) {
      console.error('Email yuborishda xatolik:', error);
      throw new BadRequestException('Emailga xat yuborib bo\'lmadi. Gmail sozlamalarini tekshiring!');
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

    if (!user || user.otpCode !== dto.code) {
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
      { sub: user.id, email: user.email },
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
}