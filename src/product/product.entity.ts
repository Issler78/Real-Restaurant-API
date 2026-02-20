import { CategoryEntity } from '../category/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int'})
  price: number; // save as cents

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  category: CategoryEntity

  @Column({ type: 'boolean', default: true })
  available: boolean;
}
