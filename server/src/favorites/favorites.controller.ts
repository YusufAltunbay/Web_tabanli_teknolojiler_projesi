import { Controller, Post, Delete, Get, Body, Request, Param, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
  constructor(private readonly favService: FavoritesService) {}

  // Listemi Getir
  @Get()
  getMyFavorites(@Request() req) {
    return this.favService.getUserFavorites(req.user.userId);
  }

  // Ekle
  @Post()
  addFavorite(@Request() req, @Body('bookId') bookId: number) {
    return this.favService.addFavorite(req.user.userId, bookId);
  }

  // Çıkar (Sil)
  @Delete(':bookId')
  removeFavorite(@Request() req, @Param('bookId') bookId: number) {
    return this.favService.removeFavorite(req.user.userId, bookId);
  }
}