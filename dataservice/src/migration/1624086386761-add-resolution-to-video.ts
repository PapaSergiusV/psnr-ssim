import {MigrationInterface, QueryRunner} from "typeorm";

export class addResolutionToVideo1624086386761 implements MigrationInterface {
    name = 'addResolutionToVideo1624086386761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" ADD "resolution" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "resolution"`);
    }

}
