/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryEntity } from './category/category.entity';
import { CategoryModule } from './category/category.module';
import { CountryEntity } from './country/country.entity';
import { CountryModule } from './country/country.module';
import { GastronomicCultureEntity } from './gastronomic-culture/gastronomic-culture.entity';
import { GastronomicCultureModule } from './gastronomic-culture/gastronomic-culture.module';
import { MichelinStarEntity } from './michelinstar/michelinstar.entity';
import { MichelinStarModule } from './michelinstar/michelinstar.module';
import { ProductEntity } from './product/product.entity';
import { ProductModule } from './product/product.module';
import { RecipeEntity } from './recipe/recipe.entity';
import { RecipeModule } from './recipe/recipe.module';
import { RestaurantEntity } from './restaurant/restaurant.entity';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
 imports: [GastronomicCultureModule, RecipeModule, CategoryModule, ProductModule, CountryModule, RestaurantModule, MichelinStarModule,
   TypeOrmModule.forRoot({
     type: 'postgres',
     host: 'localhost',
     port: 5432,
     username: 'postgres',
     password: 'Fexi1010#',
     database: 'museum',
     entities: [CategoryEntity, ProductEntity, CountryEntity, RestaurantEntity, MichelinStarEntity, GastronomicCultureEntity, RecipeEntity],
     dropSchema: true,
     synchronize: true,
     keepConnectionAlive: true
   }),
 ],
 controllers: [AppController],
 providers: [AppService],
})
export class AppModule {}