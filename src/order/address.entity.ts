import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('addresses')
export class AddressEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    street: string;
    
    @Column({ type: 'varchar', length: 6 })
    number: string;

    @Column({ type: 'varchar', length: 50 })
    neighborhood: string;

    @Column({ type: 'varchar', length: 255 })
    city: string;

    @Column({ type: 'varchar', length: 255 })
    state: string;

    @Column({ type: 'char', length: 8, name: 'zip_code' })
    zipCode: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    complement: string|null;
}