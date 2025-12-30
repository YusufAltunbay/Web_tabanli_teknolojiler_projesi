import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './loan.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan) private loanRepo: Repository<Loan>,
    @InjectRepository(Book) private bookRepo: Repository<Book>,
  ) {}

  // Tüm Ödünçleri Getir (Admin İçin)
  async findAll() {
    return this.loanRepo.find({
      relations: ['book', 'user'],
      order: { borrowDate: 'DESC' },
    });
  }

  // Kullanıcının Ödünçleri
  async findMyLoans(userId: number) {
    return this.loanRepo.find({
      where: { user: { id: userId } },
      relations: ['book'],
      order: { borrowDate: 'DESC' },
    });
  }

  // Kitap Ödünç Al (GÜNCELLENDİ: Aynı kitap kontrolü eklendi)
  async borrowBook(userId: number, bookId: number) {
    // 1. Kitabı Bul
    const book = await this.bookRepo.findOneBy({ id: bookId });
    if (!book) throw new BadRequestException('Kitap bulunamadı');

    // --- YENİ EKLENEN KISIM: KONTROL ---
    // Kullanıcı bu kitabı daha önce almış mı ve hala elinde mi?
    const existingLoan = await this.loanRepo.findOne({
        where: {
            user: { id: userId },
            book: { id: bookId }
        }
    });

    if (existingLoan) {
        throw new BadRequestException('Bu kitabı zaten ödünç aldınız! İade etmeden tekrar alamazsınız.');
    }
    // ------------------------------------

    // 2. Stok Kontrolü
    if (book.stock <= 0) {
      throw new BadRequestException('Üzgünüz, bu kitabın stoğu tükenmiş.');
    }

    // 3. Stoğu düş
    book.stock -= 1;
    await this.bookRepo.save(book);

    // 4. İade Tarihini Hesapla (Bugün + 30 Gün)
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 30);

    // 5. Kaydı oluştur
    const loan = this.loanRepo.create({
      user: { id: userId } as User,
      book: { id: bookId } as Book,
      borrowDate: new Date(),
      returnDate: returnDate, // Tahmini iade tarihi
    });
    
    return this.loanRepo.save(loan);
  }

  // Kitap İade Et
  async returnBook(loanId: number) {
    const loan = await this.loanRepo.findOne({ 
      where: { id: loanId },
      relations: ['book']
    });

    if (!loan) throw new BadRequestException('Ödünç kaydı bulunamadı.');

    // 1. Kitabın stoğunu artır
    if (loan.book) {
      loan.book.stock += 1;
      await this.bookRepo.save(loan.book);
    }

    // 2. Ödünç kaydını sil
    return this.loanRepo.delete(loanId);
  }
}