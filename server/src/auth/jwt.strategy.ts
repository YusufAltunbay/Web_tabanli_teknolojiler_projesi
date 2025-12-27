import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Token'ı "Bearer <token>" başlığından (header) al
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Süresi dolmuş token'ı reddet
      secretOrKey: jwtConstants.secret, // Şifreleme anahtarımız (constants.ts dosyasından)
    });
  }

  // Token geçerliyse bu çalışır ve kullanıcı bilgisini döner
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}