import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from '../reviews/review.entity';
import { Loan } from '../loans/loan.entity';
import { Favorite } from '../favorites/favorite.entity';

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

 @Column({ type: 'text', nullable: true }) 
  avatar: string | null;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;
  
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Loan, (loan) => loan.user)
  loans: Loan[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
}