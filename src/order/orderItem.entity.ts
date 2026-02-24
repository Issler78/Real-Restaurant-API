import { OrderEntity } from './order.entity';
import { ProductEntity } from '../product/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('order_items')
export class OrderItemsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  order: OrderEntity;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int'})
  unitPrice: number; // save as cents

  @Column({ type: 'int'})
  total: number; // save as cents

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes?: string;
}
