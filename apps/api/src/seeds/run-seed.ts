import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AdminSeed } from './admin-seed';

async function bootstrap() {
  console.log('Starting seeder...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(AdminSeed);
  try {
    await seeder.seedAdmin();
    await seeder.seedCategories();
    console.log('Seeding complete.');
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();
