import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

// Entities
import { Manga } from './manga/domain/manga.entity.js';
import { Manhwa } from './manhwa/domain/manhwa.entity.js';
import { Manhua } from './manhua/domain/manhua.entity.js';

// Manga slices
import { AddMangaController } from './manga/add-manga/add-manga.controller.js';
import { AddMangaService } from './manga/add-manga/add-manga.service.js';
import { GetAllMangaController } from './manga/get-all-manga/get-all-manga.controller.js';
import { GetAllMangaService } from './manga/get-all-manga/get-all-manga.service.js';
import { UpdateChaptersMangaController } from './manga/update-chapters/update-chapters.controller.js';
import { UpdateChaptersMangaService } from './manga/update-chapters/update-chapters.service.js';
import { DisableMangaController } from './manga/disable-manga/disable-manga.controller.js';
import { DisableMangaService } from './manga/disable-manga/disable-manga.service.js';

// Manhwa slices
import { AddManhwaController } from './manhwa/add-manhwa/add-manhwa.controller.js';
import { AddManhwaService } from './manhwa/add-manhwa/add-manhwa.service.js';
import { GetAllManhwaController } from './manhwa/get-all-manhwa/get-all-manhwa.controller.js';
import { GetAllManhwaService } from './manhwa/get-all-manhwa/get-all-manhwa.service.js';
import { UpdateChaptersManhwaController } from './manhwa/update-chapters/update-chapters.controller.js';
import { UpdateChaptersManhwaService } from './manhwa/update-chapters/update-chapters.service.js';
import { DisableManhwaController } from './manhwa/disable-manhwa/disable-manhwa.controller.js';
import { DisableManhwaService } from './manhwa/disable-manhwa/disable-manhwa.service.js';

// Manhua slices
import { AddManhuaController } from './manhua/add-manhua/add-manhua.controller.js';
import { AddManhuaService } from './manhua/add-manhua/add-manhua.service.js';
import { GetAllManhuaController } from './manhua/get-all-manhua/get-all-manhua.controller.js';
import { GetAllManhuaService } from './manhua/get-all-manhua/get-all-manhua.service.js';
import { UpdateChaptersManhuaController } from './manhua/update-chapters/update-chapters.controller.js';
import { UpdateChaptersManhuaService } from './manhua/update-chapters/update-chapters.service.js';
import { DisableManhuaController } from './manhua/disable-manhua/disable-manhua.controller.js';
import { DisableManhuaService } from './manhua/disable-manhua/disable-manhua.service.js';

// Reading
import { GetAllReadingController } from './reading/get-all-reading/get-all-reading.controller.js';
import { GetAllReadingService } from './reading/get-all-reading/get-all-reading.service.js';

// Import
import { ImportWorksController } from './import/import-works/import-works.controller.js';
import { ImportWorksService } from './import/import-works/import-works.service.js';

// Cloudinary
import { CloudinaryService } from './cloudinary/cloudinary.service.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? {
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
          }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'mangadb',
          }),
      entities: [Manga, Manhwa, Manhua],
      synchronize: true,
    }),
  ],
  controllers: [
    AppController,
    AddMangaController,
    GetAllMangaController,
    UpdateChaptersMangaController,
    DisableMangaController,
    AddManhwaController,
    GetAllManhwaController,
    UpdateChaptersManhwaController,
    DisableManhwaController,
    AddManhuaController,
    GetAllManhuaController,
    UpdateChaptersManhuaController,
    DisableManhuaController,
    GetAllReadingController,
    ImportWorksController,
  ],
  providers: [
    AppService,
    // Repository providers
    {
      provide: 'MangaRepository',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Manga),
      inject: [DataSource],
    },
    {
      provide: 'ManhwaRepository',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Manhwa),
      inject: [DataSource],
    },
    {
      provide: 'ManhuaRepository',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Manhua),
      inject: [DataSource],
    },
    // Cloudinary
    CloudinaryService,
    {
      provide: 'CloudinaryService',
      useExisting: CloudinaryService,
    },
    // Scraper placeholder
    {
      provide: 'ScraperService',
      useValue: {
        async fetchManga() { return []; },
        async fetchManhwa() { return []; },
        async fetchManhua() { return []; },
      },
    },
    // Services
    AddMangaService,
    GetAllMangaService,
    UpdateChaptersMangaService,
    DisableMangaService,
    AddManhwaService,
    GetAllManhwaService,
    UpdateChaptersManhwaService,
    DisableManhwaService,
    AddManhuaService,
    GetAllManhuaService,
    UpdateChaptersManhuaService,
    DisableManhuaService,
    GetAllReadingService,
    ImportWorksService,
  ],
})
export class AppModule {}
