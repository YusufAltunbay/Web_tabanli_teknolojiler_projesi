import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Bu eksik olabilir
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity'; // <-- Entity'yi import et

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // <-- BU SATIR ÇOK ÖNEMLİ
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}