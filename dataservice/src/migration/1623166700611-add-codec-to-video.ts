import {MigrationInterface, QueryRunner} from "typeorm";

export class addCodecToVideo1623166700611 implements MigrationInterface {
    name = 'addCodecToVideo1623166700611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" ADD "codec" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "codec"`);
    }

}
