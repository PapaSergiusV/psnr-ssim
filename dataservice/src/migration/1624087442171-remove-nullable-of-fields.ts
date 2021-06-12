import {MigrationInterface, QueryRunner} from "typeorm";

export class removeNullableOfFields1624087442171 implements MigrationInterface {
    name = 'removeNullableOfFields1624087442171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" ALTER COLUMN "codec" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" ALTER COLUMN "resolution" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" ALTER COLUMN "resolution" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" ALTER COLUMN "codec" DROP NOT NULL`);
    }

}
