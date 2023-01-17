import { Test, TestingModule } from '@nestjs/testing';
import { GastronomicCultureService } from './gastronomic-culture.service';
import { Repository } from 'typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('GastronomicCultureService', () => {
  let service: GastronomicCultureService;
  let repository: Repository<GastronomicCultureEntity>;
  let gastronomicList: GastronomicCultureEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [GastronomicCultureService],
    }).compile();

    service = module.get<GastronomicCultureService>(GastronomicCultureService);

    repository = module.get<Repository<GastronomicCultureEntity>>(getRepositoryToken(GastronomicCultureService));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    gastronomicList = [];
    for(let i = 0; i < 5; i++){
      const gastronomic: GastronomicCultureEntity = await repository.save({
        name: faker.company.companyName(),
        description: faker.company.companyName()})
      gastronomicList.push(gastronomic);
    }
  }

  it('findAll should return all Gastronomic Cultures', async () => {
    const gastronomic: GastronomicCultureEntity[] = await service.findAll();
    expect(gastronomic).not.toBeNull();
    expect(gastronomic).toHaveLength(gastronomicList.length);
  });

  it('findOne should return a Gastronomic Culture by id', async () => {
    const storedGastronomic: GastronomicCultureEntity = gastronomicList[0];
    const gastronomic: GastronomicCultureEntity = await service.findOne(storedGastronomic.id);
    expect(gastronomic).not.toBeNull();
    expect(gastronomic.name).toEqual(storedGastronomic.name)
  });

  it('findOne should throw an exception for an invalid Gastronomic Culture', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The Gastronomic Culture with the given id was not found")
  });

  it('create should return a Gastronomic Culture', async () => {
    const gastronomic: GastronomicCultureEntity  = {
      id: "",
      name: faker.company.companyName(),
      description: faker.company.companyName(),
      recipes: [],
      products:[],
      countries:[],
      restaurants:[],
    }

    const newGastronomic:GastronomicCultureEntity = await service.create(gastronomic);
    expect(newGastronomic).not.toBeNull();

    const storedGastronomic: GastronomicCultureEntity = await repository.findOne({where: {id: newGastronomic.id}})
    expect(gastronomic).not.toBeNull();
    expect(gastronomic.name).toEqual(storedGastronomic.name)
    expect(gastronomic.description).toEqual(storedGastronomic.description)
    expect(gastronomic.recipes).toEqual(storedGastronomic.recipes)
    expect(gastronomic.products).toEqual(storedGastronomic.products)
    expect(gastronomic.countries).toEqual(storedGastronomic.countries)
    expect(gastronomic.restaurants).toEqual(storedGastronomic.restaurants)
  });

  it('update should modify a Gastronomic Culture', async () => {
    const gastronomic: GastronomicCultureEntity = gastronomicList[0];
    gastronomic.name = "New name"
    const updatedGastronomic: GastronomicCultureEntity = await service.update(gastronomic.id, gastronomic);
    expect(updatedGastronomic).not.toBeNull();
    const storedGastronomic: GastronomicCultureEntity = await repository.findOne({where:{id: gastronomic.id}})
    expect(storedGastronomic).not.toBeNull();
    expect(storedGastronomic.name).toEqual(gastronomic.name)
  });

  it('update should throw an exception for an invalid Gastronomic Culture', async () => {
    let gastronomic: GastronomicCultureEntity = gastronomicList[0];
    gastronomic = {
      ...gastronomic, name: "New name"
    }
    await expect(() => service.update("0", gastronomic)).rejects.toHaveProperty("message", "The Gastronomic Culture with the given id was not found")
  });

  it('delete should remove a Gastronomic Culture', async () => {
    const gastronomic: GastronomicCultureEntity = gastronomicList[0];
    await service.delete(gastronomic.id);
    const deletedGastronomic: GastronomicCultureEntity = await repository.findOne({ where: { id: gastronomic.id } })
    expect(deletedGastronomic).toBeNull();
  });

  it('delete should throw an exception for an invalid Gastronomic Culture', async () => {
    const gastronomic: GastronomicCultureEntity = gastronomicList[0];
    await service.delete(gastronomic.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The Gastronomic Culture with the given id was not found")
  });
    


});
