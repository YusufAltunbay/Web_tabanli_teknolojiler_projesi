import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
       throw new UnauthorizedException("Kullanıcı bulunamadı");
    }
    
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Şifre yanlış");
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      id: user.id,
      username: user.username,
      role: user.role,
      avatar: user.avatar // GÜNCELLENDİ: Avatarı da gönderiyoruz
    };
  }

  async register(userDto: any) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    
    // GÜNCELLENDİ: Avatarı da servise gönderiyoruz
    return this.usersService.create(
      userDto.username, 
      hashedPassword, 
      userDto.role || 'member',
      userDto.avatar // <-- Yeni
    );
  }
}