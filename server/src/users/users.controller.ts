import { Controller, Get, Delete, Put, Param, Body, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin: Tüm kullanıcıları listele
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  //@Roles(UserRole.ADMIN)
  getAllUsers() {
    return this.usersService.findAll();
  }

  // Admin: Kullanıcı sil
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  // Herkes: Kendi şifresini güncelle
 @Put('profile')
@UseGuards(AuthGuard('jwt'))
updateProfile(@Request() req, @Body() body: any) { // Body'yi komple alıyoruz
  // password ve avatar'ı ayıklayıp servise yolluyoruz
  return this.usersService.updateProfile(req.user.userId, { 
    password: body.password, 
    avatar: body.avatar 
  });
}

  // --- YENİ EKLENEN: ROL DEĞİŞTİRME (Sadece Admin) ---
  @Put(':id/role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  changeRole(@Param('id') id: number, @Body('role') role: UserRole) {
    return this.usersService.updateRole(id, role);
  }
}