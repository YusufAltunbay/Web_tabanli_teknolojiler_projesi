import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  findAll() {
    return this.authorRepository.find();
  }

  create(name: string, bio: string) {
    const newAuthor = this.authorRepository.create({ name, bio });
    return this.authorRepository.save(newAuthor);
  }
}