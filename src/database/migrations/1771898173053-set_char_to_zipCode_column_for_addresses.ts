import { MigrationInterface, QueryRunner } from "typeorm";

export class SetCharToZipCodeColumnForAddresses1771898173053 implements MigrationInterface {
    name = 'SetCharToZipCodeColumnForAddresses1771898173053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "zip_code"`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "zip_code" character(8) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "zip_code"`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "zip_code" character varying(8) NOT NULL`);
    }

}
