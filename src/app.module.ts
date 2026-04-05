import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddMangaController } from './manga/add-manga/add-manga.controller';
import { AddMangaService } from './manga/add-manga/add-manga.service';
import { AddMangaDto } from './manga/add-manga/add-manga.dto';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'mangadb',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [
    AppController,
    AddMangaController,
  ],
  providers: [
    AppService,
    AddMangaService,
    AddMangaDto
  ],
})
export class AppModule {}
