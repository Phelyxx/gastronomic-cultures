import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestaurantGastronomicCultureService } from './restaurant-gastronomic-culture.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('RestaurantGastronomicCultureService', () => {
  let service: RestaurantGastronomicCultureService;
  let restaurantRepository: Repository<RestaurantEntity>;
  let gastronomicCultureRepository: Repository<GastronomicCultureEntity>;
  let restaurant: RestaurantEntity;
  let gastronomicCulturesList: GastronomicCultureEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantGastronomicCultureService],
    }).compile();

    service = module.get<RestaurantGastronomicCultureService>(RestaurantGastronomicCultureService);
    restaurantRepository = module.get<Repository<RestaurantEntity>>(getRepositoryToken(RestaurantEntity));
    gastronomicCultureRepository = module.get<Repository<GastronomicCultureEntity>>(getRepositoryToken(GastronomicCultureEntity));
  
    await seedDatabase();
  });

  const seedDatabase = async () => {
    gastronomicCultureRepository.clear();
    restaurantRepository.clear();

    gastronomicCulturesList = [];
    for(let i = 0; i < 5; i++){
        const gastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
          name: faker.company.companyName(),
          description: faker.lorem.sentence()
        })
        gastronomicCulturesList.push(gastronomicCulture);
    }

    restaurant = await restaurantRepository.save({
      name: faker.company.companyName(),
      city: faker.address.city(),
      gastronomicCultures: gastronomicCulturesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addGastronomicCultureRestaurant should add an gastronomicCulture to a restaurant', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.companyName(), 
      description: faker.lorem.sentence(), 
      address: faker.address.secondaryAddress(), 
      city: faker.address.city(), 
      image: faker.image.imageUrl()
    })

    const result: RestaurantEntity = await service.addGastronomicCultureRestaurant(newRestaurant.id, newGastronomicCulture.id);
    
    expect(result.gastronomicCultures.length).toBe(1);
    expect(result.gastronomicCultures[0]).not.toBeNull();
    expect(result.gastronomicCultures[0].name).toBe(newGastronomicCulture.name)
    expect(result.gastronomicCultures[0].description).toBe(newGastronomicCulture.description)
  });

  it('addGastronomicCultureRestaurant should thrown exception for an invalid gastronomicCulture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.companyName(), 
      description: faker.lorem.sentence(), 
      address: faker.address.secondaryAddress(), 
      city: faker.address.city(), 
      image: faker.image.imageUrl()
    })

    await expect(() => service.addGastronomicCultureRestaurant(newRestaurant.id, "0")).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found");
  });

  it('addGastronomicCultureRestaurant should throw an exception for an invalid restaurant', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(() => service.addGastronomicCultureRestaurant("0", newGastronomicCulture.id)).rejects.toHaveProperty("message", "The restaurant with the given id was not found");
  });

  it('findGastronomicCultureByRestaurantIdGastronomicCultureId should return gastronomicCulture by restaurant', async () => {
    const gastronomicCulture: GastronomicCultureEntity = gastronomicCulturesList[0];
    const storedGastronomicCulture: GastronomicCultureEntity = await service.findGastronomicCultureByRestaurantIdGastronomicCultureId(restaurant.id, gastronomicCulture.id, )
    expect(storedGastronomicCulture).not.toBeNull();
    expect(storedGastronomicCulture.name).toBe(gastronomicCulture.name);
    expect(storedGastronomicCulture.description).toBe(gastronomicCulture.description);
  });

  it('findGastronomicCultureByRestaurantIdGastronomicCultureId should throw an exception for an invalid gastronomicCulture', async () => {
    await expect(()=> service.findGastronomicCultureByRestaurantIdGastronomicCultureId(restaurant.id, "0")).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found"); 
  });

  it('findGastronomicCultureByRestaurantIdGastronomicCultureId should throw an exception for an invalid restaurant', async () => {
    const gastronomicCulture: GastronomicCultureEntity = gastronomicCulturesList[0]; 
    await expect(()=> service.findGastronomicCultureByRestaurantIdGastronomicCultureId("0", gastronomicCulture.id)).rejects.toHaveProperty("message", "The restaurant with the given id was not found"); 
  });

  it('findGastronomicCultureByRestaurantIdGastronomicCultureId should throw an exception for an gastronomicCulture not associated to the restaurant', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(()=> service.findGastronomicCultureByRestaurantIdGastronomicCultureId(restaurant.id, newGastronomicCulture.id)).rejects.toHaveProperty("message", "The gastronomicCulture with the given id is not associated to the restaurant"); 
  });

  it('findGastronomicCulturesByRestaurantId should return gastronomicCultures by restaurant', async ()=>{
    const gastronomicCultures: GastronomicCultureEntity[] = await service.findGastronomicCulturesByRestaurantId(restaurant.id);
    expect(gastronomicCultures.length).toBe(5)
  });

  it('findGastronomicCulturesByRestaurantId should throw an exception for an invalid restaurant', async () => {
    await expect(()=> service.findGastronomicCulturesByRestaurantId("0")).rejects.toHaveProperty("message", "The restaurant with the given id was not found"); 
  });

  it('associateGastronomicCulturesRestaurant should update gastronomicCultures list for a restaurant', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl() 
    });

    const updatedRestaurant: RestaurantEntity = await service.associateGastronomicCulturesRestaurant(restaurant.id, [newGastronomicCulture]);
    expect(updatedRestaurant.gastronomicCultures.length).toBe(1);

    expect(updatedRestaurant.gastronomicCultures[0].name).toBe(newGastronomicCulture.name);
    expect(updatedRestaurant.gastronomicCultures[0].description).toBe(newGastronomicCulture.description);
  });

  it('associateGastronomicCulturesRestaurant should throw an exception for an invalid restaurant', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(()=> service.associateGastronomicCulturesRestaurant("0", [newGastronomicCulture])).rejects.toHaveProperty("message", "The restaurant with the given id was not found"); 
  });

  it('associateGastronomicCulturesRestaurant should throw an exception for an invalid gastronomicCulture', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = gastronomicCulturesList[0];
    newGastronomicCulture.id = "0";

    await expect(()=> service.associateGastronomicCulturesRestaurant(restaurant.id, [newGastronomicCulture])).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found"); 
  });

  it('deleteGastronomicCultureToRestaurant should remove an gastronomicCulture from a restaurant', async () => {
    const gastronomicCulture: GastronomicCultureEntity = gastronomicCulturesList[0];
    
    await service.deleteGastronomicCultureRestaurant(restaurant.id, gastronomicCulture.id);

    const storedRestaurant: RestaurantEntity = await restaurantRepository.findOne({where: {id: restaurant.id}, relations: ["gastronomicCultures"]});
    const deletedGastronomicCulture: GastronomicCultureEntity = storedRestaurant.gastronomicCultures.find(a => a.id === gastronomicCulture.id);

    expect(deletedGastronomicCulture).toBeUndefined();

  });

  it('deleteGastronomicCultureToRestaurant should thrown an exception for an invalid gastronomicCulture', async () => {
    await expect(()=> service.deleteGastronomicCultureRestaurant(restaurant.id, "0")).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found"); 
  });

  it('deleteGastronomicCultureToRestaurant should thrown an exception for an invalid restaurant', async () => {
    const gastronomicCulture: GastronomicCultureEntity = gastronomicCulturesList[0];
    await expect(()=> service.deleteGastronomicCultureRestaurant("0", gastronomicCulture.id)).rejects.toHaveProperty("message", "The restaurant with the given id was not found"); 
  });

  it('deleteGastronomicCultureToRestaurant should thrown an exception for an non asocciated gastronomicCulture', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(()=> service.deleteGastronomicCultureRestaurant(restaurant.id, newGastronomicCulture.id)).rejects.toHaveProperty("message", "The gastronomicCulture with the given id is not associated to the restaurant"); 
  }); 
});
