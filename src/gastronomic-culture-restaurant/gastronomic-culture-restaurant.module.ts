import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { GastronomicCultureRestaurantService } from './gastronomic-culture-restaurant.service';

@Module({
  providers: [GastronomicCultureRestaurantService],
  imports: [TypeOrmModule.forFeature([GastronomicCultureEntity, RestaurantEntity])]
})
export class GastronomicCultureRestaurantModule {}
