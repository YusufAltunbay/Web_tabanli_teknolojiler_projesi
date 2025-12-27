import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
  ) {}

  // Yorum Ekle
  async addReview(userId: number, bookId: number, comment: string, rating: number) {
    const review = this.reviewRepo.create({
      user: { id: userId } as User,
      book: { id: bookId } as Book,
      comment,
      rating,
    });
    return this.reviewRepo.save(review);
  }

  // Yorum Sil (Admin için)
  async deleteReview(reviewId: number) {
    return this.reviewRepo.delete(reviewId);
  }
  
  // Kitabın yorumlarını getir
  async findByBook(bookId: number) {
     return this.reviewRepo.find({ where: { book: { id: bookId } }, relations: ['user'] });
  }
}