import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserDetails1696527589276 implements MigrationInterface {
  name = 'AddUserDetails1696527589276';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_details" ("id" integer NOT NULL, "right" character varying NOT NULL, CONSTRAINT "PK_fb08394d3f499b9e441cab9ca51" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_details"`);
  }
}
