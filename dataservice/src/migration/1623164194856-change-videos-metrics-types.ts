import {MigrationInterface, QueryRunner} from "typeorm";

export class changeVideosMetricsTypes1623164194856 implements MigrationInterface {
    name = 'changeVideosMetricsTypes1623164194856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "kbps"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "kbps" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "psnr"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "psnr" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "psnr_max"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "psnr_max" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "psnr_min"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "psnr_min" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "ssim"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "ssim" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "ssim_max"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "ssim_max" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "ssim_min"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "ssim_min" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "ssim_min"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "ssim_min" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "ssim_max"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "ssim_max" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "ssim"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "ssim" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "psnr_min"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "psnr_min" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "psnr_max"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "psnr_max" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "psnr"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "psnr" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "kbps"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "kbps" integer NOT NULL`);
    }

}
