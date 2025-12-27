import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { Loan } from './loan.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Book, User])],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}