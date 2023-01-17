import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';
import { faker } from '@faker-js/faker';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';

describe('RecipeService', () => {
  let service: RecipeService;
  let repository: Repository<RecipeEntity>;
  let recipesList: RecipeEntity[]; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecipeService],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    repository = module.get<Repository<RecipeEntity>>(getRepositoryToken(RecipeEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    recipesList = [];
    for(let i = 0; i < 5; i++){
      const recipe: RecipeEntity = await repository.save({
        name: faker.company.companyName(),
        description: faker.company.companyName(),
        photo: faker.company.companyName(),
        preparation: faker.company.companyName(),
        video: faker.company.companyName()})
      recipesList.push(recipe);
    }
  }
    
    it('findAll should return all Recipes', async () => {
      const recipes: RecipeEntity[] = await service.findAll();
      expect(recipes).not.toBeNull();
      expect(recipes).toHaveLength(recipesList.length);
    });

    it('findOne should return a recipe by id', async () => {
      const storedRecipe: RecipeEntity = recipesList[0];
      const recipe: RecipeEntity = await service.findOne(storedRecipe.id);
      expect(recipe).not.toBeNull();
      expect(recipe.name).toEqual(storedRecipe.name)
    });

    it('findOne should throw an exception for an invalid Recipe', async () => {
      await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The recipe with the given id was not found")
    });

    it('create should return a new recipe', async () => {
      const recipe: RecipeEntity = {
        id: "",
        name: faker.company.companyName(),
        description: faker.company.companyName(),
        photo: faker.company.companyName(),
        preparation: faker.company.companyName(),
        video: faker.company.companyName(),
        gastronomic: new GastronomicCultureEntity(),
      }
  
      const newRecipe: RecipeEntity = await service.create(recipe);
      expect(newRecipe).not.toBeNull();
  
      const storedRecipe: RecipeEntity = await repository.findOne({where: {id: newRecipe.id}})
      expect(recipe).not.toBeNull();
      expect(recipe.name).toEqual(storedRecipe.name)
      expect(recipe.description).toEqual(storedRecipe.description)
      expect(recipe.preparation).toEqual(storedRecipe.preparation)
      expect(recipe.video).toEqual(storedRecipe.video)
      expect(recipe.gastronomic).toEqual(storedRecipe.gastronomic)
    });

    it('update should modify a Recipe', async () => {
      const recipe: RecipeEntity = recipesList[0];
      recipe.name = "New name"
      const updatedRecipe: RecipeEntity = await service.update(recipe.id, recipe);
      expect(updatedRecipe).not.toBeNull();
      const storedRecipe: RecipeEntity = await repository.findOne({where:{id: recipe.id}})
      expect(storedRecipe).not.toBeNull();
      expect(storedRecipe.name).toEqual(recipe.name)
    });

    it('update should throw an exception for an invalid Recipe', async () => {
      let recipe: RecipeEntity = recipesList[0];
      recipe = {
        ...recipe, name: "New name"
      }
      await expect(() => service.update("0", recipe)).rejects.toHaveProperty("message", "The Recipe with the given id was not found")
    });

    it('delete should remove a recipe', async () => {
      const recipe: RecipeEntity = recipesList[0];
      await service.delete(recipe.id);
      const deletedRecipe: RecipeEntity = await repository.findOne({ where: { id: recipe.id } })
      expect(deletedRecipe).toBeNull();
    });

    it('delete should throw an exception for an invalid recipe', async () => {
      const recipe: RecipeEntity = recipesList[0];
      await service.delete(recipe.id);
      await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The Recipee with the given id was not found")
    });
});
