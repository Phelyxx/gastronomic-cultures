import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeService } from './recipe.service';
import { RecipeEntity } from '../recipe/recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  providers: [RecipeService]
})
export class RecipeModule {}
