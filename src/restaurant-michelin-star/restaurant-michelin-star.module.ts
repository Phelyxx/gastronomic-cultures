import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MichelinStarEntity } from '../michelinstar/michelinstar.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { RestaurantMichelinStarService } from './restaurant-michelin-star.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity, MichelinStarEntity])],
  providers: [RestaurantMichelinStarService]
})
export class RestaurantMichelinStarModule {}
