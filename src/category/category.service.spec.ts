/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';

import { faker } from '@faker-js/faker';
import { ProductEntity } from '../product/product.entity';


describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Repository<CategoryEntity>;
  let categoriesList: CategoryEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoryService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    categoriesList = [];
    for(let i = 0; i < 5; i++){
        const category: CategoryEntity = await repository.save({
        name: faker.company.name(), 
        description: faker.lorem.sentence()})
        categoriesList.push(category);
    }
  }
  it('findAll should return all categories', async () => {
    const categories: CategoryEntity[] = await service.findAll();
    expect(categories).not.toBeNull();
    expect(categories).toHaveLength(categoriesList.length);
  });


  it('findOne should return a category by id', async () => {
    const storedCategory: CategoryEntity = categoriesList[0];
    const category: CategoryEntity = await service.findOne(storedCategory.id);
    expect(category).not.toBeNull();
    expect(category.name).toEqual(storedCategory.name)
    expect(category.description).toEqual(storedCategory.description)
  });

  it('findOne should throw an exception for an invalid category', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The category with the given id was not found")
  });

  it('create should return a new category', async () => {
    const category: CategoryEntity = {
      id: "",
      name: faker.company.name(), 
      description: faker.lorem.sentence(), 
      product: new ProductEntity(),
    }

    const newCategory: CategoryEntity = await service.create(category);
    expect(newCategory).not.toBeNull();

    const storedCategory: CategoryEntity = await repository.findOne({where: {id: newCategory.id}})
    expect(storedCategory).not.toBeNull();
    expect(storedCategory.name).toEqual(newCategory.name)
    expect(storedCategory.description).toEqual(newCategory.description)
  });

  it('update should modify a category', async () => {
    const category: CategoryEntity = categoriesList[0];
    category.name = "New name";
    category.description = "New description";
  
    const updatedCategory: CategoryEntity = await service.update(category.id, category);
    expect(updatedCategory).not.toBeNull();
  
    const storedCategory: CategoryEntity = await repository.findOne({ where: { id: category.id } })
    expect(storedCategory).not.toBeNull();
    expect(storedCategory.name).toEqual(category.name)
    expect(storedCategory.description).toEqual(category.description)
  });
 
  it('update should throw an exception for an invalid category', async () => {
    let category: CategoryEntity = categoriesList[0];
    category = {
      ...category, name: "New name", description: "New description"
    }
    await expect(() => service.update("0", category)).rejects.toHaveProperty("message", "The category with the given id was not found")
  });

  it('delete should remove a category', async () => {
    const category: CategoryEntity = categoriesList[0];
    await service.delete(category.id);
  
    const deletedCategory: CategoryEntity = await repository.findOne({ where: { id: category.id } })
    expect(deletedCategory).toBeNull();
  });

  it('delete should throw an exception for an invalid category', async () => {
    const category: CategoryEntity = categoriesList[0];
    await service.delete(category.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The category with the given id was not found")
  });
});
