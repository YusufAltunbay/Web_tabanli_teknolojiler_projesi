import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Herkes görebilir
  @Get()
  getAll() {
    return this.booksService.findAll();
  }

  // Sadece Admin: Kitap Ekle
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body('title') title: string,
    @Body('pageCount') pageCount: number,
    @Body('categoryId') categoryId: number,
    @Body('authorName') authorName: string,
    @Body('stock') stock: number,
  ) {
    return this.booksService.create(title, pageCount, categoryId, authorName, stock);
  }

  // Sadece Admin: Kitap Güncelle (PUT)
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: number, @Body() body: any) {
    return this.booksService.update(id, body);
  }

  // Sadece Admin: Kitap Sil (DELETE)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number) {
    return this.booksService.remove(id);
  }
}