import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favRepository: Repository<Favorite>,
  ) {}

  // Favoriye Ekle
  async addFavorite(userId: number, bookId: number) {
    const exists = await this.favRepository.findOne({
        where: { user: { id: userId }, book: { id: bookId } }
    });
    
    if (exists) return { message: "Zaten favorilerde ekli." };

    const fav = this.favRepository.create({
        user: { id: userId },
        book: { id: bookId }
    });
    return this.favRepository.save(fav);
  }

  // Favoriden Çıkar (YENİ)
  async removeFavorite(userId: number, bookId: number) {
    return this.favRepository.delete({ 
        user: { id: userId }, 
        book: { id: bookId } 
    });
  }

  // Kullanıcının Favorilerini Getir (YENİ - Kalpleri boyamak için lazım)
  async getUserFavorites(userId: number) {
    return this.favRepository.find({
        where: { user: { id: userId } },
        relations: ['book']
    });
  }
}