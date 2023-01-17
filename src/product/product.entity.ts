/* eslint-disable prettier/prettier */
import { CategoryEntity } from '../category/category.entity';
import { Column, Entity, JoinColumn, OneToOne, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';

@Entity()
export class ProductEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 name: string;
 
 @Column()
 history: string;
 
 @Column()
 description: string;

 @OneToOne(() => CategoryEntity, category => category.product)
 @JoinColumn()
 category: CategoryEntity;

 @ManyToOne(() => GastronomicCultureEntity, gastronomicCulture => gastronomicCulture.products)
 gastronomicCulture: GastronomicCultureEntity;
}