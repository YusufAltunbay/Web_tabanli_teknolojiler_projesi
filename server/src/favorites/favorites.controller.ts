import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('favorites')
@UseGuards(AuthGuard('jwt')) // Tüm işlemler giriş gerektirir
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  addFavorite(@Request() req, @Body('bookId') bookId: number) {
    return this.favoritesService.addFavorite(req.user.userId, bookId);
  }

  @Get()
  getMyFavorites(@Request() req) {
    return this.favoritesService.getMyFavorites(req.user.userId);
  }

  @Delete(':id')
  removeFavorite(@Param('id') id: number) {
    return this.favoritesService.removeFavorite(id);
  }
}