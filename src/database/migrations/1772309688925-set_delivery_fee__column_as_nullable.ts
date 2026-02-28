import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDeliveryFee_columnAsNullable1772309688925 implements MigrationInterface {
    name = 'SetDeliveryFee_columnAsNullable1772309688925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "delivery_fee" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "delivery_fee" SET NOT NULL`);
    }

}
