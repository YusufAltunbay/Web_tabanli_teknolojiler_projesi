import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    private usersService: UsersService,
  ) {}

  // Mesaj Gönder
  async sendMessage(senderId: number, receiverId: number, content: string) {
    // İlişkileri kurmak için user objelerini bulmamız lazım ama 
    // TypeORM ID üzerinden de save edebilir, garanti olsun diye preload yapabilirsin
    // Basit yöntem:
    return this.messageRepo.save({
      content,
      sender: { id: senderId },
      receiver: { id: receiverId },
      isRead: false
    });
  }

  // İki kişi arasındaki konuşmayı getir
  async getConversation(userId1: number, userId2: number) {
    return this.messageRepo.find({
      where: [
        { sender: { id: userId1 }, receiver: { id: userId2 } },
        { sender: { id: userId2 }, receiver: { id: userId1 } }
      ],
      order: { createdAt: 'ASC' } // Eskiden yeniye sırala
    });
  }
  async markAsRead(receiverId: number, senderId: number) {
    return this.messageRepo.update(
      { receiver: { id: receiverId }, sender: { id: senderId }, isRead: false },
      { isRead: true }
    );
  }
  async getUnreadCount(userId: number) {
    return this.messageRepo.count({
      where: { receiver: { id: userId }, isRead: false }
    });
  }
  async getUnreadCountsBySender(receiverId: number) {
    const results = await this.messageRepo
      .createQueryBuilder("message")
      .select("message.senderId", "senderId")
      .addSelect("COUNT(message.id)", "count")
      .where("message.receiverId = :receiverId", { receiverId })
      .andWhere("message.isRead = :isRead", { isRead: false })
      .groupBy("message.senderId")
      .getRawMany();

    // Dizi formatını objeye çevirelim: { senderId: count }
    const unreadMap: Record<number, number> = {};
    results.forEach(r => {
      unreadMap[r.senderId] = Number(r.count);
    });
    return unreadMap;
  }
}