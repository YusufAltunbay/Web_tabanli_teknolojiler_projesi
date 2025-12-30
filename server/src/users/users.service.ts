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

  // 2. Kullanıcı Oluştur (GÜNCELLENDİ: Avatar eklendi)
  async create(username: string, pass: string, role: string, avatar?: string): Promise<User> {
    const newUser = this.userRepository.create({
      username,
      password: pass,
      role: role as UserRole,
      avatar: avatar || null, // Avatar varsa kaydet, yoksa null
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

  // 5. Profil Güncelle (GÜNCELLENDİ: Avatar ve Şifre)
  async updateProfile(userId: number, updateData: { password?: string; avatar?: string }) {
    const user = await this.userRepository.findOneBy({ id: userId });
    
    if (!user) {
        throw new NotFoundException("Kullanıcı bulunamadı.");
    }

    // Şifre varsa güncelle
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updateData.password, salt);
    }

    // Avatar varsa güncelle
    if (updateData.avatar) {
      user.avatar = updateData.avatar;
    }
    
    return this.userRepository.save(user);
  }

  async updateRole(id: number, role: UserRole) {
    return this.userRepository.update(id, { role });
  }
}