import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValueToPaymentStatusColumn1772153081156 implements MigrationInterface {
    name = 'SetDefaultValueToPaymentStatusColumn1772153081156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "payment_status" SET DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "payment_status" DROP DEFAULT`);
    }

}
