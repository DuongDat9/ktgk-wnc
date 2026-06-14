// src/sinh-vien/sinh-vien.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SinhVien }           from './sinh-vien.entity';
import { SinhVienService }    from './sinh-vien.service';
import { SinhVienController } from './sinh-vien.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SinhVien])],
  controllers: [SinhVienController],
  providers: [SinhVienService],
  exports: [SinhVienService],   // export để các module khác (DiemSo...) dùng được
})
export class SinhVienModule {}
