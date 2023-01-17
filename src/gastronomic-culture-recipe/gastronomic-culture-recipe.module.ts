import { Module } from '@nestjs/common';
import { GastronomicCultureRecipeService } from './gastronomic-culture-recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GastronomicCultureEntity])],
  providers: [GastronomicCultureRecipeService]
})
export class GastronomicCultureRecipeModule {}
