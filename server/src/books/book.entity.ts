import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Author } from '../authors/author.entity';
import { Loan } from '../loans/loan.entity';
import { Review } from '../reviews/review.entity';
import { Favorite } from '../favorites/favorite.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  pageCount: number;

  @Column({ default: 1 }) // Yeni eklenen stok sütunu
  stock: number;

  // İlişki: Bir kitabın bir kategorisi olur
  @ManyToOne(() => Category, (category) => category.books)
  category: Category;

  // İlişki: Bir kitabın birden fazla yazarı olabilir
  @ManyToMany(() => Author, (author) => author.books)
  @JoinTable()
  authors: Author[];

  // İlişki: Bir kitabın birden fazla ödünç geçmişi olabilir
  @OneToMany(() => Loan, (loan) => loan.book)
  loans: Loan[];

  // İlişki: Bir kitabın birden fazla yorumu olabilir
  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.book)
  favorites: Favorite[];
}