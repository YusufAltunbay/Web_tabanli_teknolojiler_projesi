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

  // Gönderen
  @ManyToOne(() => User, { eager: true })
  sender: User;

  // Alan
  @ManyToOne(() => User, { eager: true })
  receiver: User;
}