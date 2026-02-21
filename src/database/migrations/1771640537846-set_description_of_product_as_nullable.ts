import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDescriptionOfProductAsNullable1771640537846 implements MigrationInterface {
    name = 'SetDescriptionOfProductAsNullable1771640537846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "description" SET NOT NULL`);
    }

}
