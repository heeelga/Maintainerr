import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArchivePath1772150400000 implements MigrationInterface {
  name = 'AddArchivePath1772150400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "settings" ADD COLUMN "archive_path" varchar`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // SQLite doesn't support DROP COLUMN directly, but since this is nullable
    // and has no default, we can recreate the table without it.
    // For simplicity, we just leave the column in place on rollback.
  }
}
