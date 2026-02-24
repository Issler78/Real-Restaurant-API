import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValueToOrderStatusColumn1771894101940 implements MigrationInterface {
    name = 'SetDefaultValueToOrderStatusColumn1771894101940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'created'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "order_status" DROP DEFAULT`);
    }

}
