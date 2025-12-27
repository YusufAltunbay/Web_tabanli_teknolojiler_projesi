import { Controller, Post, Get, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { LoansService } from './loans.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  // Admin: Tüm Ödünçleri Gör
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllLoans() {
    return this.loansService.findAll();
  }

  // Admin: Kitabı İade Al (Stoğu düzeltir ve kaydı siler)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  returnBook(@Param('id') id: number) {
    return this.loansService.returnBook(id);
  }

  // Üye: Ödünç Al
  @Post()
  @UseGuards(AuthGuard('jwt'))
  borrow(@Request() req, @Body('bookId') bookId: number) {
    return this.loansService.borrowBook(req.user.userId, bookId);
  }

  @Get('my-loans')
  @UseGuards(AuthGuard('jwt')) // Giriş yapmış herkes kullanabilir
  getMyLoans(@Request() req) {
    // Token'dan gelen userId'yi servise gönderiyoruz
    return this.loansService.findMyLoans(req.user.userId);
  }
}