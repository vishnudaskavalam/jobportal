import { MigrationInterface, QueryRunner } from 'typeorm';

import * as bcrypt from 'bcrypt';

export class SeedActualData1780427439614 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert Categories
    await queryRunner.query(`
            INSERT INTO "categories" (id, name, "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid(), 'Engineering', NOW(), NOW()),
                (gen_random_uuid(), 'Design', NOW(), NOW()),
                (gen_random_uuid(), 'Product', NOW(), NOW()),
                (gen_random_uuid(), 'Marketing', NOW(), NOW())
            ON CONFLICT (name) DO NOTHING;
        `);

    const engineeringCategory = await queryRunner.query(
      `SELECT id FROM "categories" WHERE name = 'Engineering' LIMIT 1`,
    );
    const designCategory = await queryRunner.query(
      `SELECT id FROM "categories" WHERE name = 'Design' LIMIT 1`,
    );

    // Insert Jobs if categories exist
    if (engineeringCategory.length > 0 && designCategory.length > 0) {
      await queryRunner.query(`
                INSERT INTO "jobs" (id, title, company, "yearsOfExperience", location, description, salary, type, "categoryId", "createdAt", "updatedAt")
                VALUES 
                    (gen_random_uuid(), 'Senior Full Stack Engineer', 'TechCorp Inc.', '5+ years', 'San Francisco, CA (Remote)', '<p>We are looking for an experienced engineer to lead our product development.</p>', '$140k - $180k', 'FULL_TIME', '${engineeringCategory[0].id}', NOW(), NOW()),
                    (gen_random_uuid(), 'UX/UI Designer', 'Creative Studio', '3-5 years', 'New York, NY', '<p>Join our award-winning design team.</p>', '$90k - $120k', 'FULL_TIME', '${designCategory[0].id}', NOW(), NOW()),
                    (gen_random_uuid(), 'Backend Developer (Node.js)', 'StartupX', '2-4 years', 'Remote', '<p>Scaling our infrastructure using NestJS and PostgreSQL.</p>', '$110k - $150k', 'CONTRACT', '${engineeringCategory[0].id}', NOW(), NOW())
                ON CONFLICT DO NOTHING;
            `);
    }

    // Insert Admin User
    const adminHash = await bcrypt.hash('Admin@123', 10);
    await queryRunner.query(`
            INSERT INTO "users" (id, "firstName", "lastName", email, phone, password, role, "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid(), 'Admin', 'User', 'admin@jobportal.com', '1234567890', '${adminHash}', 'ADMIN', NOW(), NOW())
            ON CONFLICT (email) DO NOTHING;
        `);

    // Insert Normal User
    const userHash = await bcrypt.hash('user123', 10);
    await queryRunner.query(`
            INSERT INTO "users" (id, "firstName", "lastName", email, phone, password, role, "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid(), 'Test', 'User', 'user@example.com', '0987654321', '${userHash}', 'USER', NOW(), NOW())
            ON CONFLICT (email) DO NOTHING;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "jobs" WHERE company IN ('TechCorp Inc.', 'Creative Studio', 'StartupX')`,
    );
    await queryRunner.query(
      `DELETE FROM "categories" WHERE name IN ('Engineering', 'Design', 'Product', 'Marketing')`,
    );
    await queryRunner.query(
      `DELETE FROM "users" WHERE email IN ('admin@example.com', 'user@example.com')`,
    );
  }
}
