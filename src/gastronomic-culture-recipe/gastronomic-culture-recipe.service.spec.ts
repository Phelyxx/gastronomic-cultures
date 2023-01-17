import { Test, TestingModule } from '@nestjs/testing';
import { GastronomicCultureRecipeService } from './gastronomic-culture-recipe.service';
import { Repository } from 'typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { RecipeEntity } from '../recipe/recipe.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('GastronomicCultureRecipeService', () => {
  let service: GastronomicCultureRecipeService;
  let gastronomicRepository: Repository<GastronomicCultureEntity>;
  let recipeRepository: Repository<RecipeEntity>;
  let gastronomic: GastronomicCultureEntity;
  let recipesList : RecipeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [GastronomicCultureRecipeService],
    }).compile();

    service = module.get<GastronomicCultureRecipeService>(GastronomicCultureRecipeService);

    gastronomicRepository = module.get<Repository<GastronomicCultureEntity>>(getRepositoryToken(GastronomicCultureEntity));
    recipeRepository = module.get<Repository<RecipeEntity>>(getRepositoryToken(RecipeEntity));

    await seedDatabase();
  });

  


  const seedDatabase = async () => {
    recipeRepository.clear();
    gastronomicRepository.clear();
 
    recipesList = [];
    for(let i = 0; i < 5; i++){
        const recipe: RecipeEntity = await recipeRepository.save({
          name: faker.company.companyName(),
          description: faker.lorem.sentence(),
          photo: faker.lorem.sentence(),
          preparation: faker.lorem.sentence(),
          video: faker.lorem.sentence(),
        })
        recipesList.push(recipe);
    }
 
    gastronomic = await gastronomicRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence(),
      recipes: recipesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRecipeGastronomic should add an Recipe to a Gastronomy Culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence(),
      photo: faker.lorem.sentence(),
      preparation: faker.lorem.sentence(),
      video: faker.lorem.sentence(),
    });
    const newGastronomic: GastronomicCultureEntity = await gastronomicRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence(),
    })

    const result: GastronomicCultureEntity = await service.addRecipeGastronomic(newGastronomic.id, newRecipe.id);
    
    expect(result.recipes.length).toBe(1);
    expect(result.recipes[0]).not.toBeNull();
    expect(result.recipes[0].name).toBe(newRecipe.name)
    expect(result.recipes[0].description).toBe(newRecipe.description)
    expect(result.recipes[0].photo).toBe(newRecipe.photo)
    expect(result.recipes[0].preparation).toBe(newRecipe.preparation)
    expect(result.recipes[0].video).toBe(newRecipe.video)
  });

  it('addRecipeGastronomic should thrown exception for an invalid recipe', async () => {
    const newGastronomic: GastronomicCultureEntity = await gastronomicRepository.save({
      name: faker.company.companyName(), 
      description: faker.lorem.sentence(), 
    })

    await expect(() => service.addRecipeGastronomic(newGastronomic.id, "0")).rejects.toHaveProperty("message", "The Recipe with the given id was not found");
  });

  it('addRecipeGastronomic should throw an exception for an invalidGastronomic culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence(),
      photo: faker.lorem.sentence(),
      preparation: faker.lorem.sentence(),
      video: faker.lorem.sentence(),
    });

    await expect(() => service.addRecipeGastronomic("0", newRecipe.id)).rejects.toHaveProperty("message", "The Gastronomic Culture with the given id was not found");
  });

  it('findRecipeByGastronomicIdRecipId should return recipe by gastronomic culture', async () => {
    const recipe: RecipeEntity = recipesList[0];
    const storedRecipe: RecipeEntity = await service.findRecipeByGastronomicIdRecipId(gastronomic.id, recipe.id, )
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toBe(recipe.name);
    expect(storedRecipe.description).toBe(recipe.description);
    expect(storedRecipe.photo).toBe(recipe.photo);
    expect(storedRecipe.preparation).toBe(recipe.preparation);
    expect(storedRecipe.video).toBe(recipe.video);
  });

  it('findRecipeByGastronomicIdRecipId should throw an exception for an invalid Recipe', async () => {
    await expect(()=> service.findRecipeByGastronomicIdRecipId(gastronomic.id, "0")).rejects.toHaveProperty("message", "The Recipe with the given id was not found"); 
  });

  it('findRecipeByGastronomicIdRecipId should throw an exception for an invalid Gastronomic Culture', async () => {
    const artwork: RecipeEntity = recipesList[0]; 
    await expect(()=> service.findRecipeByGastronomicIdRecipId("0", artwork.id)).rejects.toHaveProperty("message", "The GASTRONOMIC with the given id was not found"); 
  });

  it('findRecipeByGastronomicIdRecipId should throw an exception for an artwork not associated to the Gastronomic Culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence(),
      photo: faker.lorem.sentence(),
      preparation: faker.lorem.sentence(),
      video: faker.lorem.sentence(),
    });

    await expect(()=> service.findRecipeByGastronomicIdRecipId(gastronomic.id, newRecipe.id)).rejects.toHaveProperty("message", "The recipe with the given id is not associated to the Gastronomic Culture"); 
  });

  it('findRecipesByGastronomicId should return artworks by GC', async ()=>{
    const recipes: RecipeEntity[] = await service.findRecipesByGastronomicId(gastronomic.id);
    expect(recipes.length).toBe(5)
  });

  it('findRecipesByGastronomicId should throw an exception for an invalid GC', async () => {
    await expect(()=> service.findRecipesByGastronomicId("0")).rejects.toHaveProperty("message", "The GC with the given id was not found"); 
  });

  it('associateRecipesGastronomic should update recipes list for a GC', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence(),
      photo: faker.lorem.sentence(),
      preparation: faker.lorem.sentence(),
      video: faker.lorem.sentence(), 
    });

    const updatedGastronomic: GastronomicCultureEntity = await service.associateRecipesGastronomic(gastronomic.id, [newRecipe]);
    expect(updatedGastronomic.recipes.length).toBe(1);
    expect(updatedGastronomic.recipes[0].name).toBe(newRecipe.name);
    expect(updatedGastronomic.recipes[0].description).toBe(newRecipe.description);
    expect(updatedGastronomic.recipes[0].photo).toBe(newRecipe.photo);
    expect(updatedGastronomic.recipes[0].preparation).toBe(newRecipe.preparation);
    expect(updatedGastronomic.recipes[0].video).toBe(newRecipe.video);
  });

  it('associateRecipesGastronomic should throw an exception for an invalid GC', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence(),
      photo: faker.lorem.sentence(),
      preparation: faker.lorem.sentence(),
      video: faker.lorem.sentence(), 
    });

    await expect(()=> service.associateRecipesGastronomic("0", [newRecipe])).rejects.toHaveProperty("message", "The GC with the given id was not found"); 
  });

  it('associateRecipesGastronomic should throw an exception for an invalid recipe', async () => {
    const newRecipe: RecipeEntity = recipesList[0];
    newRecipe.id = "0";

    await expect(()=> service.associateRecipesGastronomic(gastronomic.id, [newRecipe])).rejects.toHaveProperty("message", "The recipe with the given id was not found"); 
  });

  it('deleteRecipeGastronomic should remove an recipe from a GC', async () => {
    const recipe: RecipeEntity = recipesList[0];
    
    await service.deleteRecipeGastronomic(gastronomic.id, recipe.id);

    const storedGastronomic: GastronomicCultureEntity = await gastronomicRepository.findOne({where: {id: gastronomic.id}, relations: ["recipes"]});
    const deletedRecipe: RecipeEntity = storedGastronomic.recipes.find(a => a.id === recipe.id);

    expect(deletedRecipe).toBeUndefined();

  });

  it('deleteRecipeGastronomic should thrown an exception for an invalid recipe', async () => {
    await expect(()=> service.deleteRecipeGastronomic(gastronomic.id, "0")).rejects.toHaveProperty("message", "The recipe with the given id was not found"); 
  });

  it('deleteRecipeGastronomic should thrown an exception for an invalid GC', async () => {
    const recipe: RecipeEntity = recipesList[0];
    await expect(()=> service.deleteRecipeGastronomic("0", recipe.id)).rejects.toHaveProperty("message", "The GC with the given id was not found"); 
  });

  it('deleteRecipeGastronomic should thrown an exception for an non asocciated recipe', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence(),
      photo: faker.lorem.sentence(),
      preparation: faker.lorem.sentence(),
      video: faker.lorem.sentence(), 
    });

    await expect(()=> service.deleteRecipeGastronomic(gastronomic.id, newRecipe.id)).rejects.toHaveProperty("message", "The recipe with the given id is not associated to the GC"); 
  }); 




  



});
