import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) private favRepo: Repository<Favorite>,
    @InjectRepository(Book) private bookRepo: Repository<Book>,
  ) {}

  // Favorilere Ekle (Varsa hata verme, yoksa ekle)
  async addFavorite(userId: number, bookId: number) {
    const book = await this.bookRepo.findOneBy({ id: bookId });
    if (!book) throw new BadRequestException('Kitap bulunamadı');

    // Zaten ekli mi?
    const exists = await this.favRepo.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
    });

    if (exists) return { message: 'Zaten favorilerde ekli.' };

    const fav = this.favRepo.create({
      user: { id: userId } as User,
      book: { id: bookId } as Book,
    });
    return this.favRepo.save(fav);
  }

  // Kullanıcının Favorilerini Getir
  async getMyFavorites(userId: number) {
    return this.favRepo.find({
      where: { user: { id: userId } },
      relations: ['book'], // Kitap detaylarını getir
    });
  }

  // Favoriden Çıkar
  async removeFavorite(favId: number) {
    return this.favRepo.delete(favId);
  }
}