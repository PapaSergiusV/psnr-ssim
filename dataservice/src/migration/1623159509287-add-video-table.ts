import { MigrationInterface, QueryRunner } from "typeorm";

export class addVideoTable1623159509287 implements MigrationInterface {
    name = 'addVideoTable1623159509287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "video" ("id" SERIAL NOT NULL, "ip" character varying NOT NULL, "path" character varying NOT NULL, "kbps" integer NOT NULL, "psnr" integer NOT NULL, "psnr_max" integer NOT NULL, "psnr_min" integer NOT NULL, "ssim" integer NOT NULL, "ssim_max" integer NOT NULL, "ssim_min" integer NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "video"`);
    }

}
