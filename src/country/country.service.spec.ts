import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CountryEntity } from './country.entity';
import { CountryService } from './country.service';

import { faker } from '@faker-js/faker';

describe('CountryService', () => {
  let service: CountryService;
  let repository: Repository<CountryEntity>;
  let countriesList: CountryEntity[]; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CountryService],
    }).compile();

    service = module.get<CountryService>(CountryService);
    repository = module.get<Repository<CountryEntity>>(getRepositoryToken(CountryEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    countriesList = [];
    for(let i = 0; i < 5; i++){
      const country: CountryEntity = await repository.save({
        name: faker.company.companyName()})
      countriesList.push(country);
    }
  }

  it('findAll should return all countries', async () => {
    const countries: CountryEntity[] = await service.findAll();
    expect(countries).not.toBeNull();
    expect(countries).toHaveLength(countriesList.length);
  });

  it('findOne should return a museum by id', async () => {
    const storedCountry: CountryEntity = countriesList[0];
    const country: CountryEntity = await service.findOne(storedCountry.id);
    expect(country).not.toBeNull();
    expect(country.name).toEqual(storedCountry.name)
  });

  it('findOne should throw an exception for an invalid country', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The country with the given id was not found")
  });

  it('create should return a new country', async () => {
    const country: CountryEntity = {
      id: "",
      name: faker.company.companyName(),
      gastronomicCultures: []
    }

    const newCountry: CountryEntity = await service.create(country);
    expect(newCountry).not.toBeNull();

    const storedCountry: CountryEntity = await repository.findOne({where: {id: newCountry.id}})
    expect(country).not.toBeNull();
    expect(country.name).toEqual(storedCountry.name)
  });

  it('update should modify a country', async () => {
    const country: CountryEntity = countriesList[0];
    country.name = "New name"
    const updatedCountry: CountryEntity = await service.update(country.id, country);
    expect(updatedCountry).not.toBeNull();
    const storedCountry: CountryEntity = await repository.findOne({where:{id: country.id}})
    expect(storedCountry).not.toBeNull();
    expect(storedCountry.name).toEqual(country.name)
  });

  it('update should throw an exception for an invalid country', async () => {
    let country: CountryEntity = countriesList[0];
    country = {
      ...country, name: "New name"
    }
    await expect(() => service.update("0", country)).rejects.toHaveProperty("message", "The country with the given id was not found")
  });

  it('delete should remove a country', async () => {
    const country: CountryEntity = countriesList[0];
    await service.delete(country.id);
     const deletedCountry: CountryEntity = await repository.findOne({ where: { id: country.id } })
    expect(deletedCountry).toBeNull();
  });

  it('delete should throw an exception for an invalid country', async () => {
    const country: CountryEntity = countriesList[0];
    await service.delete(country.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The country with the given id was not found")
  });
});

