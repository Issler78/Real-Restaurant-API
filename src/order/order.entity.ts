import { AddressEntity } from './address.entity';
import { OrderStatus } from './enums/orderStatus.enum';
import { OrderType } from './enums/orderType.enum';
import { PaymentMethod } from './enums/paymentMethod.enum';
import { PaymentStatus } from './enums/paymentStatus.enum';
import { PaymentTiming } from './enums/paymentTiming.enum';
import { OrderItemsEntity } from './orderItem.entity';
import { UserEntity } from '../user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  @Column({ name: 'customer_id', nullable: true })
  customerId?: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer?: UserEntity;

  @Column({ type: 'boolean' })
  pickup: boolean;

  @Column({ name: 'address_id', nullable: true })
  addressId?: string;

  @ManyToOne(() => AddressEntity, { nullable: true, cascade: true })
  @JoinColumn({ name: 'address_id' })
  address?: AddressEntity;

  @OneToMany(() => OrderItemsEntity, (item) => item.order, { cascade: true })
  items: OrderItemsEntity[];

  @Column({ type: 'int', name: 'delivery_fee', nullable: true })
  deliveryFee: number; // save as cents

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes?: string;

  @Column({ type: 'enum', enum: PaymentMethod, name: 'payment_method' })
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentTiming, name: 'payment_timing' })
  paymentTiming: PaymentTiming;

  @Column({ type: 'boolean', nullable: true, name: 'needs_change' })
  needsChange?: boolean;

  @Column({ type: 'int', nullable: true, name: 'change_for' })
  changeFor?: number; // save as cents

  @Column({ type: 'enum', enum: PaymentStatus, name: 'payment_status', default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'enum', enum: OrderStatus, name: 'order_status', default: OrderStatus.CREATED })
  orderStatus: OrderStatus;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'internal_notes',
  })
  internalNotes?: string;

  @Column({ type: 'int' })
  subtotal: number; // save as cents value of all items

  @Column({ type: 'int' })
  total: number; // save as cents value of all items + delivery fee

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
