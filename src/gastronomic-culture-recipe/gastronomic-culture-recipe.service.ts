import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { RecipeEntity } from '../recipe/recipe.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class GastronomicCultureRecipeService {

    constructor(
        @InjectRepository(GastronomicCultureEntity)
        private readonly gastronomicRepository: Repository<GastronomicCultureEntity>,
    
        @InjectRepository(RecipeEntity)
        private readonly recipeRepository: Repository<RecipeEntity>
    ) {}

    async addRecipeGastronomic(gastronomicId: string, recipeId: string): Promise<GastronomicCultureEntity> {
        const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: recipeId}});
        if (!recipe)
          throw new BusinessLogicException("The Recipe with the given id was not found", BusinessError.NOT_FOUND);
      
        const gastronomic: GastronomicCultureEntity = await this.gastronomicRepository.findOne({where: {id: gastronomicId}, relations: ["recipes","products","countries","restaurant"]})
        if (!gastronomic)
          throw new BusinessLogicException("The Gastronomic Culture with the given id was not found", BusinessError.NOT_FOUND);
    
        gastronomic.recipes = [...gastronomic.recipes, recipe];
        return await this.gastronomicRepository.save(gastronomic);
      }

      async findRecipeByGastronomicIdRecipId(gastronomicId: string, recipeId: string): Promise<RecipeEntity> {
        const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: recipeId}});
        if (!recipe)
          throw new BusinessLogicException("The Recipe with the given id was not found", BusinessError.NOT_FOUND)
       
        const gastronomic: GastronomicCultureEntity = await this.gastronomicRepository.findOne({where: {id: gastronomicId}, relations: ["recipes"]});
        if (!gastronomic)
          throw new BusinessLogicException("The Gastronomioc Culture with the given id was not found", BusinessError.NOT_FOUND)
   
        const gastronomicRecipe: RecipeEntity = gastronomic.recipes.find(e => e.id === recipe.id);
   
        if (!gastronomicRecipe)
          throw new BusinessLogicException("The Recipe with the given id is not associated to the Gastronomic Culture", BusinessError.PRECONDITION_FAILED)
   
        return gastronomicRecipe;
    }

    async findRecipesByGastronomicId(gastronomicId: string): Promise<RecipeEntity[]> {
        const gastronomic: GastronomicCultureEntity = await this.gastronomicRepository.findOne({where: {id: gastronomicId}, relations: ["recipes"]});
        if (!gastronomic)
          throw new BusinessLogicException("The Gastronomic Culture with the given id was not found", BusinessError.NOT_FOUND)
       
        return gastronomic.recipes;
    }
    async associateRecipesGastronomic(gastronomicId: string, recipes: RecipeEntity[]): Promise<GastronomicCultureEntity> {
        const gastronomic: GastronomicCultureEntity = await this.gastronomicRepository.findOne({where: {id: gastronomicId}, relations: ["recipes"]});
    
        if (!gastronomic)
          throw new BusinessLogicException("The Gastronomic Culture with the given id was not found", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < recipes.length; i++) {
          const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: recipes[i].id}});
          if (!recipe)
            throw new BusinessLogicException("The Recipe with the given id was not found", BusinessError.NOT_FOUND)
        }
    
        gastronomic.recipes = recipes;
        return await this.gastronomicRepository.save(gastronomic);
      }

      async deleteRecipeGastronomic(gastronomicId: string, recipeId: string){
        const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: recipeId}});
        if (!recipe)
          throw new BusinessLogicException("The Recip with the given id was not found", BusinessError.NOT_FOUND)
    
        const gastronomic: GastronomicCultureEntity = await this.gastronomicRepository.findOne({where: {id: gastronomicId}, relations: ["artworks"]});
        if (!gastronomic)
          throw new BusinessLogicException("The Gastronomy Culture with the given id was not found", BusinessError.NOT_FOUND)
    
        const gastronomicRecipe: RecipeEntity = gastronomic.recipes.find(e => e.id === recipe.id);
    
        if (!gastronomicRecipe)
            throw new BusinessLogicException("The recipe with the given id is not associated to the gastronomic culture", BusinessError.PRECONDITION_FAILED)
 
        gastronomic.recipes = gastronomic.recipes.filter(e => e.id !== recipeId);
        await this.gastronomicRepository.save(gastronomic);
    }




}
