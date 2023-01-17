/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../../category/category.entity';
import { ProductEntity } from '../..//product/product.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [CategoryEntity, ProductEntity],
   synchronize: true,
   keepConnectionAlive: true    
 }),
 TypeOrmModule.forFeature([CategoryEntity, ProductEntity]),
];
