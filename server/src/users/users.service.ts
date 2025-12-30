import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 1. Kullanıcı Bul
  async findOne(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  // 2. Kullanıcı Oluştur (DÜZELTME BURADA)
  async create(username: string, pass: string, role: string): Promise<User> {
    const newUser = this.userRepository.create({
      username,
      password: pass,
      // Gelen string'i UserRole tipine zorluyoruz
      role: role as UserRole, 
    });
    return this.userRepository.save(newUser);
  }

  // 3. Tüm kullanıcılar
  findAll() {
    return this.userRepository.find();
  }

  // 4. Sil
  async remove(id: number) {
    return this.userRepository.delete(id);
  }

  // 5. Profil Güncelle
  async updateProfile(userId: number, password?: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    
    if (!user) {
        throw new NotFoundException("Kullanıcı bulunamadı.");
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    return this.userRepository.save(user);
  }
  async updateRole(id: number, role: UserRole) {
    return this.userRepository.update(id, { role });
  }
}