import { MigrationInterface, QueryRunner } from "typeorm";

export class SetNullableToPaymentTimingColumn1772596524850 implements MigrationInterface {
    name = 'SetNullableToPaymentTimingColumn1772596524850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "payment_timing" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "payment_timing" SET NOT NULL`);
    }

}
