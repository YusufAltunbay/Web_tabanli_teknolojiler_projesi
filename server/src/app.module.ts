import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';
import { LoansModule } from './loans/loans.module';
import { FavoritesModule } from './favorites/favorites.module';
import { MessagesModule } from './messages/messages.module';


@Module({
  imports: [
    // .env dosyasını yine de okuyabiliriz (JWT secret vb. için), kalsın.
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // SQLite Bağlantı Ayarları
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'kutuphane.db', // Proje klasöründe bu isimde bir dosya oluşacak
      autoLoadEntities: true,
      synchronize: true, // Tabloları otomatik oluşturur
    }),

    // Diğer modüllerimiz
    AuthModule,
    UsersModule,
    CategoriesModule,
    AuthorsModule,
    BooksModule,
    ReviewsModule,
    LoansModule,
    FavoritesModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}