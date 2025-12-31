import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  sender: User;

  // GÜNCELLEME: onDelete: 'CASCADE' ekledik
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  receiver: User;
}