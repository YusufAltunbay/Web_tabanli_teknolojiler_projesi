import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { Category } from '../categories/category.entity';
import { Author } from '../authors/author.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  // 1. Tüm kitapları getir
  findAll() {
    return this.bookRepository.find({
      relations: ['category', 'authors'],
    });
  }

  // 2. Kitap Ekle
  async create(title: string, pageCount: number, categoryId: number, authorName: string, stock: number, imageUrl: string) {
    const book = new Book();
    book.title = title;
    book.pageCount = pageCount;
    book.stock = stock;
    book.imageUrl = imageUrl; // <-- YENİ: Kaydediyoruz
    book.category = { id: categoryId } as Category;

    // ... yazar işlemleri aynı ...
    let author = await this.authorRepository.findOne({ where: { name: authorName } });
    if (!author) {
      author = this.authorRepository.create({ name: authorName, bio: 'Otomatik oluşturuldu' });
      author = await this.authorRepository.save(author);
    }
    book.authors = [author];

    return this.bookRepository.save(book);
  }

  // 3. Kitap Güncelle (EKSİK OLABİLİR, KONTROL ET)
  async update(id: number, updateData: any) {
    // updateData içinde { title: '...', stock: 5 } gibi veriler gelir
    await this.bookRepository.update(id, updateData);
    return this.bookRepository.findOne({ where: { id } });
  }

  // 4. Kitap Sil (EKSİK OLABİLİR, KONTROL ET)
  async remove(id: number) {
    return this.bookRepository.delete(id);
  }
}