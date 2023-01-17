/* eslint-disable prettier/prettier */
import { ProductEntity } from '../product/product.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CategoryEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 name: string;

 @Column()
 description: string;

 @OneToOne(() => ProductEntity, product => product.category)
 product: ProductEntity;
}