import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from './review.entity';
import { Book } from '../books/book.entity'; // Kitap kontrolü için lazım olabilir
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Book, User])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}