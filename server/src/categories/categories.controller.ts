import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport'; // Giriş yapmış olmayı zorunlu kılalım
// import { RolesGuard } from '../auth/roles.guard'; // İstersen sadece Admin'e özel yapabilirsin

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAll() {
    return this.categoriesService.findAll();
  }

  // Frontend'deki "Hızlı Kategori Ekle" modali buraya istek atar
  @Post()
  @UseGuards(AuthGuard('jwt')) // Sadece giriş yapmış kullanıcılar ekleyebilsin
  create(@Body('name') name: string) {
    return this.categoriesService.create(name);
  }
}