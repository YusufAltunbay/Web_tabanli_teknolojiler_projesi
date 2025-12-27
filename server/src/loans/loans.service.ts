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

  // Tüm Ödünçleri Getir (Admin İçin) - Kitap ve Kullanıcı bilgisiyle
  async findAll() {
    return this.loanRepo.find({
      relations: ['book', 'user'],
      order: { borrowDate: 'DESC' }, // En yeniler üstte
    });
  }
  async findMyLoans(userId: number) {
    return this.loanRepo.find({
      where: { user: { id: userId } }, // Sadece bu user ID'ye ait olanlar
      relations: ['book'], // Kitap detaylarını da getir
      order: { borrowDate: 'DESC' },
    });
  }

  // Kitap Ödünç Al (Stok Kontrollü ve 1 Aylık)
  async borrowBook(userId: number, bookId: number) {
    const book = await this.bookRepo.findOneBy({ id: bookId });
    if (!book) throw new BadRequestException('Kitap bulunamadı');

    if (book.stock <= 0) {
      throw new BadRequestException('Üzgünüz, bu kitabın stoğu tükenmiş.');
    }

    // 1. Stoğu düş
    book.stock -= 1;
    await this.bookRepo.save(book);

    // 2. İade Tarihini Hesapla (Bugün + 30 Gün)
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 30);

    // 3. Kaydı oluştur
    const loan = this.loanRepo.create({
      user: { id: userId } as User,
      book: { id: bookId } as Book,
      borrowDate: new Date(),
      returnDate: returnDate, // Hesaplanan tarih
    });
    
    return this.loanRepo.save(loan);
  }

  // Kitap İade Et (Admin veya Sistem)
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

    // 2. Ödünç kaydını sil (veya istersen 'status: returned' gibi bir sütun ekleyip güncelleyebilirsin)
    // Şimdilik listeden kaldırıyoruz:
    return this.loanRepo.delete(loanId);
  }
}