import { Controller, Post, Body, Param, Delete, Get, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Yorum Yap (Herkes)
  @Post()
  @UseGuards(AuthGuard('jwt'))
  addReview(
    @Request() req,
    @Body('bookId') bookId: number,
    @Body('comment') comment: string,
    @Body('rating') rating: number,
  ) {
    return this.reviewsService.addReview(req.user.userId, bookId, comment, rating);
  }

  // Yorum Sil (Sadece Admin)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteReview(@Param('id') id: number) {
    return this.reviewsService.deleteReview(id);
  }
  
  // Bir kitabın yorumlarını gör
  @Get('book/:bookId')
  getReviews(@Param('bookId') bookId: number) {
      return this.reviewsService.findByBook(bookId);
  }
}