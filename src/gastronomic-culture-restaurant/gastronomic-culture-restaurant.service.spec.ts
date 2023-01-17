import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { GastronomicCultureRestaurantService } from './gastronomic-culture-restaurant.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('GastronomicCultureRestaurantService', () => {
  let service: GastronomicCultureRestaurantService;
  let gastronomicCultureRepository: Repository<GastronomicCultureEntity>;
  let restaurantRepository: Repository<RestaurantEntity>;
  let gastronomicCulture: GastronomicCultureEntity;
  let restaurant: RestaurantEntity;
  let restaurantsList: RestaurantEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [GastronomicCultureRestaurantService],
    }).compile();

    service = module.get<GastronomicCultureRestaurantService>(GastronomicCultureRestaurantService);
    gastronomicCultureRepository = module.get<Repository<GastronomicCultureEntity>>(getRepositoryToken(GastronomicCultureEntity));
    restaurantRepository = module.get<Repository<RestaurantEntity>>(getRepositoryToken(RestaurantEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restaurantRepository.clear();
    gastronomicCultureRepository.clear();

    restaurantsList = [];
    for(let i = 0; i < 5; i++){
        const restaurant: RestaurantEntity = await restaurantRepository.save({
          name: faker.company.companyName(), 
          city: faker.address.city()
        })
        restaurantsList.push(restaurant);
    }

    gastronomicCulture = await gastronomicCultureRepository.save({
      name: faker.company.companyName(), 
      description: faker.lorem.sentence(), 
      restaurants: restaurantsList,
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestaurantGastronomicCulture should add an restaurant to a gastronomicCulture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(), 
      description: faker.lorem.sentence(), 
      address: faker.address.secondaryAddress(), 
      city: faker.address.city(), 
      image: faker.image.imageUrl()
    })

    const result: GastronomicCultureEntity = await service.addRestaurantGastronomicCulture(newGastronomicCulture.id, newRestaurant.id);
    
    expect(result.restaurants.length).toBe(1);
    expect(result.restaurants[0]).not.toBeNull();
    expect(result.restaurants[0].name).toBe(newRestaurant.name)
    expect(result.restaurants[0].city).toBe(newRestaurant.city)
  });

  it('addRestaurantGastronomicCulture should thrown exception for an invalid restaurant', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.companyName(), 
      description: faker.lorem.sentence(), 
      address: faker.address.secondaryAddress(), 
      city: faker.address.city(), 
      image: faker.image.imageUrl()
    })

    await expect(() => service.addRestaurantGastronomicCulture(newGastronomicCulture.id, "0")).rejects.toHaveProperty("message", "The restaurant with the given id was not found");
  });

  it('addRestaurantGastronomicCulture should throw an exception for an invalid gastronomicCulture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(() => service.addRestaurantGastronomicCulture("0", newRestaurant.id)).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found");
  });

  it('findRestaurantByGastronomicCultureIdRestaurantId should return restaurant by gastronomicCulture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    const storedRestaurant: RestaurantEntity = await service.findRestaurantByGastronomicCultureIdRestaurantId(gastronomicCulture.id, restaurant.id, )
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toBe(restaurant.name);
    expect(storedRestaurant.city).toBe(restaurant.city);
  });

  it('findRestaurantByGastronomicCultureIdRestaurantId should throw an exception for an invalid restaurant', async () => {
    await expect(()=> service.findRestaurantByGastronomicCultureIdRestaurantId(gastronomicCulture.id, "0")).rejects.toHaveProperty("message", "The restaurant with the given id was not found"); 
  });

  it('findRestaurantByGastronomicCultureIdRestaurantId should throw an exception for an invalid gastronomicCulture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0]; 
    await expect(()=> service.findRestaurantByGastronomicCultureIdRestaurantId("0", restaurant.id)).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found"); 
  });

  it('findRestaurantByGastronomicCultureIdRestaurantId should throw an exception for an restaurant not associated to the gastronomicCulture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(()=> service.findRestaurantByGastronomicCultureIdRestaurantId(gastronomicCulture.id, newRestaurant.id)).rejects.toHaveProperty("message", "The restaurant with the given id is not associated to the gastronomicCulture"); 
  });

  it('findRestaurantsByGastronomicCultureId should return restaurants by gastronomicCulture', async ()=>{
    const restaurants: RestaurantEntity[] = await service.findRestaurantsByGastronomicCultureId(gastronomicCulture.id);
    expect(restaurants.length).toBe(5)
  });

  it('findRestaurantsByGastronomicCultureId should throw an exception for an invalid gastronomicCulture', async () => {
    await expect(()=> service.findRestaurantsByGastronomicCultureId("0")).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found"); 
  });

  it('associateRestaurantsGastronomicCulture should update restaurants list for a gastronomicCulture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl() 
    });

    const updatedGastronomicCulture: GastronomicCultureEntity = await service.associateRestaurantsGastronomicCulture(gastronomicCulture.id, [newRestaurant]);
    expect(updatedGastronomicCulture.restaurants.length).toBe(1);

    expect(updatedGastronomicCulture.restaurants[0].name).toBe(newRestaurant.name);
    expect(updatedGastronomicCulture.restaurants[0].city).toBe(newRestaurant.city);
  });

  it('associateRestaurantsGastronomicCulture should throw an exception for an invalid gastronomicCulture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(()=> service.associateRestaurantsGastronomicCulture("0", [newRestaurant])).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found"); 
  });

  it('associateRestaurantsGastronomicCulture should throw an exception for an invalid restaurant', async () => {
    const newRestaurant: RestaurantEntity = restaurantsList[0];
    newRestaurant.id = "0";

    await expect(()=> service.associateRestaurantsGastronomicCulture(gastronomicCulture.id, [newRestaurant])).rejects.toHaveProperty("message", "The restaurant with the given id was not found"); 
  });

  it('deleteRestaurantToGastronomicCulture should remove an restaurant from a gastronomicCulture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    
    await service.deleteRestaurantGastronomicCulture(gastronomicCulture.id, restaurant.id);

    const storedGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.findOne({where: {id: gastronomicCulture.id}, relations: ["restaurants"]});
    const deletedRestaurant: RestaurantEntity = storedGastronomicCulture.restaurants.find(a => a.id === restaurant.id);

    expect(deletedRestaurant).toBeUndefined();

  });

  it('deleteRestaurantToGastronomicCulture should thrown an exception for an invalid restaurant', async () => {
    await expect(()=> service.deleteRestaurantGastronomicCulture(gastronomicCulture.id, "0")).rejects.toHaveProperty("message", "The restaurant with the given id was not found"); 
  });

  it('deleteRestaurantToGastronomicCulture should thrown an exception for an invalid gastronomicCulture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(()=> service.deleteRestaurantGastronomicCulture("0", restaurant.id)).rejects.toHaveProperty("message", "The gastronomicCulture with the given id was not found"); 
  });

  it('deleteRestaurantToGastronomicCulture should thrown an exception for an non asocciated restaurant', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(()=> service.deleteRestaurantGastronomicCulture(gastronomicCulture.id, newRestaurant.id)).rejects.toHaveProperty("message", "The restaurant with the given id is not associated to the gastronomicCulture"); 
  }); 

});
