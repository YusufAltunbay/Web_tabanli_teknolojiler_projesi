import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  borrowDate: Date;

  @Column({ nullable: true })
  returnDate: Date;

  // DÜZELTME BURADA: { onDelete: 'CASCADE' } ekliyoruz
  @ManyToOne(() => User, (user) => user.loans, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Book, (book) => book.loans, { onDelete: 'CASCADE' })
  book: Book;
}