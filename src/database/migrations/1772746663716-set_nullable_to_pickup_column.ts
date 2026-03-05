import { MigrationInterface, QueryRunner } from "typeorm";

export class SetNullableToPickupColumn1772746663716 implements MigrationInterface {
    name = 'SetNullableToPickupColumn1772746663716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "pickup" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "pickup" SET NOT NULL`);
    }

}
