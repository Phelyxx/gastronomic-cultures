import { Test, TestingModule } from '@nestjs/testing';
import { CountryEntity } from '../country/country.entity';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CountryGastronomicCultureService } from './country-gastronomic-culture.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CountryGastronomicCultureService', () => {
  let service: CountryGastronomicCultureService;
  let countryRepository: Repository<CountryEntity>;
  let gastronomicCultureRepository: Repository<GastronomicCultureEntity>;
  let country: CountryEntity;
  let gastronomicCulturesList: GastronomicCultureEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CountryGastronomicCultureService],
    }).compile();

    service = module.get<CountryGastronomicCultureService>(CountryGastronomicCultureService);
    countryRepository = module.get<Repository<CountryEntity>>(getRepositoryToken(CountryEntity));
    gastronomicCultureRepository = module.get<Repository<GastronomicCultureEntity>>(getRepositoryToken(GastronomicCultureEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    gastronomicCultureRepository.clear();
    countryRepository.clear();

    gastronomicCulturesList = [];
    for(let i = 0; i < 5; i++){
        const gastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
          name: faker.company.companyName(),
          description: faker.lorem.sentence()
        })
        gastronomicCulturesList.push(gastronomicCulture);
    }

    country = await countryRepository.save({
      name: faker.company.companyName(),
      gastronomicCultures: gastronomicCulturesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addGastronomicCultureCountry should add an gastronomicCulture to a country', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence()
    });

    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.company.companyName()
    })

    const result: CountryEntity = await service.addGastronomicCultureCountry(newCountry.id, newGastronomicCulture.id);
    
    expect(result.gastronomicCultures.length).toBe(1);
    expect(result.gastronomicCultures[0]).not.toBeNull();
    expect(result.gastronomicCultures[0].name).toBe(newGastronomicCulture.name)
    expect(result.gastronomicCultures[0].description).toBe(newGastronomicCulture.description)
  });

  it('addGastronomicCultureCountry should thrown exception for an invalid gastronomicCulture', async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.company.companyName()
    })

    await expect(() => service.addGastronomicCultureCountry(newCountry.id, "0")).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found");
  });

  it('addGastronomicCultureCountry should throw an exception for an invalid country', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(), 
      description: faker.lorem.sentence()
    });

    await expect(() => service.addGastronomicCultureCountry("0", newGastronomicCulture.id)).rejects.toHaveProperty("message", "The country with the given id was not found");
  });

  it('findGastronomicCultureByCountryIdGastronomicCultureId should return gastronomicCulture by country', async () => {
    const gastronomicCulture: GastronomicCultureEntity = gastronomicCulturesList[0];
    const storedGastronomicCulture: GastronomicCultureEntity = await service.findGastronomicCultureByCountryIdGastronomicCultureId(country.id, gastronomicCulture.id, )
    expect(storedGastronomicCulture).not.toBeNull();
    expect(storedGastronomicCulture.name).toBe(gastronomicCulture.name);
    expect(storedGastronomicCulture.description).toBe(gastronomicCulture.description);
  });

  it('findGastronomicCultureByCountryIdGastronomicCultureId should throw an exception for an invalid gastronomicCulture', async () => {
    await expect(()=> service.findGastronomicCultureByCountryIdGastronomicCultureId(country.id, "0")).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found"); 
  });

  it('findGastronomicCultureByCountryIdGastronomicCultureId should throw an exception for an invalid country', async () => {
    const gastronomicCulture: GastronomicCultureEntity = gastronomicCulturesList[0]; 
    await expect(()=> service.findGastronomicCultureByCountryIdGastronomicCultureId("0", gastronomicCulture.id)).rejects.toHaveProperty("message", "The country with the given id was not found"); 
  });

  it('findGastronomicCultureByCountryIdGastronomicCultureId should throw an exception for an gastronomicCulture not associated to the country', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence()
    });

    await expect(()=> service.findGastronomicCultureByCountryIdGastronomicCultureId(country.id, newGastronomicCulture.id)).rejects.toHaveProperty("message", "The gastronomicCulture with the given id is not associated to the country"); 
  });

  it('findGastronomicCulturesByCountryId should return gastronomicCultures by country', async ()=>{
    const gastronomicCultures: GastronomicCultureEntity[] = await service.findGastronomicCulturesByCountryId(country.id);
    expect(gastronomicCultures.length).toBe(5)
  });

  it('findGastronomicCulturesByCountryId should throw an exception for an invalid country', async () => {
    await expect(()=> service.findGastronomicCulturesByCountryId("0")).rejects.toHaveProperty("message", "The country with the given id was not found"); 
  });

  it('associateGastronomicCulturesCountry should update gastronomicCultures list for a country', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence()
    });

    const updatedCountry: CountryEntity = await service.associateGastronomicCulturesCountry(country.id, [newGastronomicCulture]);
    expect(updatedCountry.gastronomicCultures.length).toBe(1);

    expect(updatedCountry.gastronomicCultures[0].name).toBe(newGastronomicCulture.name);
    expect(updatedCountry.gastronomicCultures[0].description).toBe(newGastronomicCulture.description);
  });

  it('associateGastronomicCulturesCountry should throw an exception for an invalid country', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence()
    });

    await expect(()=> service.associateGastronomicCulturesCountry("0", [newGastronomicCulture])).rejects.toHaveProperty("message", "The country with the given id was not found"); 
  });

  it('associateGastronomicCulturesCountry should throw an exception for an invalid gastronomicCulture', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = gastronomicCulturesList[0];
    newGastronomicCulture.id = "0";

    await expect(()=> service.associateGastronomicCulturesCountry(country.id, [newGastronomicCulture])).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found"); 
  });

  it('deleteGastronomicCultureToCountry should remove an gastronomicCulture from a country', async () => {
    const gastronomicCulture: GastronomicCultureEntity = gastronomicCulturesList[0];
    
    await service.deleteGastronomicCultureCountry(country.id, gastronomicCulture.id);

    const storedCountry: CountryEntity = await countryRepository.findOne({where: {id: country.id}, relations: ["gastronomicCultures"]});
    const deletedGastronomicCulture: GastronomicCultureEntity = storedCountry.gastronomicCultures.find(a => a.id === gastronomicCulture.id);

    expect(deletedGastronomicCulture).toBeUndefined();

  });

  it('deleteGastronomicCultureToCountry should thrown an exception for an invalid gastronomicCulture', async () => {
    await expect(()=> service.deleteGastronomicCultureCountry(country.id, "0")).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found"); 
  });

  it('deleteGastronomicCultureToCountry should thrown an exception for an invalid country', async () => {
    const gastronomicCulture: GastronomicCultureEntity = gastronomicCulturesList[0];
    await expect(()=> service.deleteGastronomicCultureCountry("0", gastronomicCulture.id)).rejects.toHaveProperty("message", "The country with the given id was not found"); 
  });

  it('deleteGastronomicCultureToCountry should thrown an exception for an non asocciated gastronomicCulture', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(),
      description: faker.lorem.sentence()
    });

    await expect(()=> service.deleteGastronomicCultureCountry(country.id, newGastronomicCulture.id)).rejects.toHaveProperty("message", "The gastronomicCulture with the given id is not associated to the country"); 
  }); 

});
