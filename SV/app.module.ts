// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SinhVienModule } from './sinh-vien/sinh-vien.module';
import { SinhVien }       from './sinh-vien/sinh-vien.entity';

@Module({
  imports: [
    // ── Đọc biến môi trường từ .env ──────────────────────
    ConfigModule.forRoot({ isGlobal: true }),

    // ── Kết nối MySQL qua TypeORM ─────────────────────────
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type:        'mysql',
        host:        config.get('DB_HOST',     'localhost'),
        port:        config.get<number>('DB_PORT', 3306),
        username:    config.get('DB_USER',     'root'),
        password:    config.get('DB_PASSWORD', ''),
        database:    config.get('DB_NAME',     'student_management'),
        entities:    [SinhVien],
        synchronize: false,   // KHÔNG dùng synchronize=true trên production
        charset:     'utf8mb4',
      }),
    }),

    // ── Feature modules ───────────────────────────────────
    SinhVienModule,
  ],
})
export class AppModule {}


// ─────────────────────────────────────────────────────────
// .env  (file cấu hình, đặt ở thư mục gốc project)
// ─────────────────────────────────────────────────────────
/*
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_management
PORT=3000
*/
