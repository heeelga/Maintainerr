import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArchivePathMapping1772236800000 implements MigrationInterface {
  name = 'AddArchivePathMapping1772236800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "settings" ADD COLUMN "archive_source_path_prefix" varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD COLUMN "archive_target_path_prefix" varchar`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // SQLite doesn't support DROP COLUMN directly.
    // For simplicity, we leave the columns in place on rollback.
  }
}
