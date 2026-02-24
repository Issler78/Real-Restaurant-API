import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersTable1771893661742 implements MigrationInterface {
    name = 'CreateOrdersTable1771893661742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying(255) NOT NULL, "number" character varying(6) NOT NULL, "neighborhood" character varying(50) NOT NULL, "city" character varying(255) NOT NULL, "state" character varying(255) NOT NULL, "zip_code" character varying(8) NOT NULL, "complement" character varying(255), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_type_enum" AS ENUM('delivery', 'counter')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_payment_method_enum" AS ENUM('cash', 'pix', 'cretid_card', 'debit_card')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_payment_timing_enum" AS ENUM('before', 'on_delivery')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_payment_status_enum" AS ENUM('pending', 'paid', 'failed', 'refunded')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_order_status_enum" AS ENUM('created', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'canceled')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."orders_type_enum" NOT NULL, "customer_id" uuid, "pickup" boolean NOT NULL, "address_id" uuid, "delivery_fee" integer NOT NULL, "notes" character varying(255), "payment_method" "public"."orders_payment_method_enum" NOT NULL, "payment_timing" "public"."orders_payment_timing_enum" NOT NULL, "needs_change" boolean, "change_for" integer, "payment_status" "public"."orders_payment_status_enum" NOT NULL, "order_status" "public"."orders_order_status_enum" NOT NULL, "internal_notes" character varying(255), "subtotal" integer NOT NULL, "total" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" character varying NOT NULL, "product_id" integer NOT NULL, "quantity" integer NOT NULL, "unitPrice" integer NOT NULL, "total" integer NOT NULL, "notes" character varying(255), "orderId" uuid, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_d39c53244703b8534307adcd073" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_d39c53244703b8534307adcd073"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_order_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_timing_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_type_enum"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }

}
