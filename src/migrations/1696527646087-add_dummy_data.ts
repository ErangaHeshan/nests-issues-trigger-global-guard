import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDummyData1696527646087 implements MigrationInterface {
  name = 'AddDummyData1696527646087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO user_details("id", "right") VALUES ('1', 'subscription'), ('2', 'read')`,
    );
  }

  public async down(_: QueryRunner): Promise<void> {}
}
