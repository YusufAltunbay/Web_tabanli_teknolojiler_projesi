import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { Favorite } from './favorite.entity';
import { Book } from '../books/book.entity'; // Kitap kontrolü için

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Book])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}