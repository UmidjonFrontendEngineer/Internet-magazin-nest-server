import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
const FormData = require('form-data');
const IMGBB_API_KEY = process.env.IMGBB_API_KEY

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) { }

  async register(dto: any) {
    const existing = await this.db.query(
      'SELECT * FROM "Users" WHERE "userName" = $1',
      [dto.userName],
    );
    if (existing.rows.length > 0) {
      throw new BadRequestException('Bu foydalanuvchi nomi allaqachon band!');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.db.query(
      `INSERT INTO "Users" ("userName", "firstName", "lastName", "email", "phone", "password", "gender", image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, "userName", "firstName", "lastName", email, phone, gender, image, "createdAt"`,
      [
        dto.userName,
        dto.firstName || null,
        dto.lastName || null,
        dto.email || null,
        dto.phone,
        hashedPassword,
        dto.gender || null,
        dto.image || 'https://i.ibb.co/nNZrjBSD/user.png',
      ],
    );

    const user = result.rows[0];
    const token = this.jwtService.sign({ sub: user.id, userName: user.userName });
    return {
      message: 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz!',
      token,
      user,
    };
  }

  async login(dto: any) {
    const result = await this.db.query(
      'SELECT * FROM "Users" WHERE "userName" = $1',
      [dto.userName],
    );
    const user = result.rows[0];

    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi nomi yoki parol xato!');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Foydalanuvchi nomi yoki parol xato!');
    }

    const token = this.jwtService.sign({ sub: user.id, userName: user.userName });
    delete user.password;

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
         SET "firstName" = $1, 
             "lastName" = $2, 
             email = $3, 
             phone = $4, 
             gender = $5, 
             bio = $6,
             "image" = COALESCE(NULLIF($7, ''), "image") 
         WHERE id = $8 
         RETURNING id, "userName", "firstName", "lastName", email, phone, gender, bio, image, "createdAt"`,
        [
          dto.firstName,
          dto.lastName,
          dto.email,
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
      throw new UnauthorizedException('Token yaroqsiz yoki xatolik yuz berdi');
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

  async updateUserImage(token: string, file: any) {
    try {
      const decoded = this.jwtService.verify(token, { secret: 'SUPER_SECRET_KEY_123' });

      if (!file) {
        throw new UnauthorizedException('Rasm topilmadi');
      }

      const formData = new FormData();
      formData.append('image', file.buffer.toString('base64'));

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const imgbbData = await imgbbRes.json();

      if (!imgbbData.success) {
        throw new UnauthorizedException('Rasmni ImgBB ga yuklab bo\'lmadi');
      }

      const imageUrl = imgbbData.data.url;

      const result = await this.db.query(
        `UPDATE "Users" SET image = $1 WHERE id = $2 RETURNING id, "userName", image`,
        [imageUrl, decoded.sub],
      );

      return {
        message: 'Rasm muvaffaqiyatli yangilandi!',
        user: result.rows[0],
      };
    } catch (err) {
      throw new UnauthorizedException('Xatolik yuz berdi: ' + err.message);
    }
  }
}