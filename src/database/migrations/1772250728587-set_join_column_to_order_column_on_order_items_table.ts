import { MigrationInterface, QueryRunner } from "typeorm";

export class SetJoinColumnToOrderColumnOnOrderItemsTable1772250728587 implements MigrationInterface {
    name = 'SetJoinColumnToOrderColumnOnOrderItemsTable1772250728587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "order_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "order_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "orderId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
