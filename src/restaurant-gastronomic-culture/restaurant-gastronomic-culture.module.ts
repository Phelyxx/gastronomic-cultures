import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { RestaurantGastronomicCultureService } from './restaurant-gastronomic-culture.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity, GastronomicCultureEntity])],
  providers: [RestaurantGastronomicCultureService]
})
export class RestaurantGastronomicCultureModule {}
