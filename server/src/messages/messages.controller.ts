import { Controller, Get, Post,Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Mesaj Gönder
  @Post()
  sendMessage(@Request() req, @Body() body: { receiverId: number; content: string }) {
    return this.messagesService.sendMessage(req.user.userId, body.receiverId, body.content);
  }

  @Get('unread-total')
  getUnreadTotal(@Request() req) {
    return this.messagesService.getUnreadCount(req.user.userId);
  }

  // Kişi bazlı okunmamış sayıları (Chat listesi için)
  @Get('unread-per-user')
  getUnreadPerUser(@Request() req) {
    return this.messagesService.getUnreadCountsBySender(req.user.userId);
  }

  // Mesajları okundu olarak işaretle
  @Patch('read/:senderId')
  markAsRead(@Request() req, @Param('senderId') senderId: string) {
    return this.messagesService.markAsRead(req.user.userId, Number(senderId));
  }
  // Bir kullanıcıyla olan mesajları getir
  @Get(':userId')
  getConversation(@Request() req, @Param('userId') otherUserId: string) {
    return this.messagesService.getConversation(req.user.userId, Number(otherUserId));
  }
}