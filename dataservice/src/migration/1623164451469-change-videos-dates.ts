import {MigrationInterface, QueryRunner} from "typeorm";

export class changeVideosDates1623164451469 implements MigrationInterface {
    name = 'changeVideosDates1623164451469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "video" ALTER COLUMN "updated_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "video" ALTER COLUMN "created_at" DROP DEFAULT`);
    }

}
