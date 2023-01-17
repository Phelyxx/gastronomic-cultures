import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MichelinStarEntity } from '../michelinstar/michelinstar.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RestaurantMichelinStarService } from './restaurant-michelinstar.service';

describe('RestaurantMichelinStarService', () => {
  let service: RestaurantMichelinStarService;
  let restaurantRepository: Repository<RestaurantEntity>;
  let michelinStarRepository: Repository<MichelinStarEntity>;
  let restaurant: RestaurantEntity;
  let michelinStarsList : MichelinStarEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantMichelinStarService],
    }).compile();

    service = module.get<RestaurantMichelinStarService>(RestaurantMichelinStarService);
    restaurantRepository = module.get<Repository<RestaurantEntity>>(getRepositoryToken(RestaurantEntity));
    michelinStarRepository = module.get<Repository<MichelinStarEntity>>(getRepositoryToken(MichelinStarEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    michelinStarRepository.clear();
    restaurantRepository.clear();

    michelinStarsList = [];
    for(let i = 0; i < 5; i++){
        const michelinStar: MichelinStarEntity = await michelinStarRepository.save({
          date: faker.date.recent()
        });
        michelinStarsList.push(michelinStar);
    };

    restaurant = await restaurantRepository.save({
      name: faker.company.companyName(), 
      city: faker.address.city(),
      michelinStars: michelinStarsList
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMichelinStarRestaurant should add an michelinStar to a restaurant', async () => {
    const newMichelinStar: MichelinStarEntity = await michelinStarRepository.save({
      date: faker.date.recent()
    });

    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.companyName(), 
      city: faker.address.city()
    });

    const result: RestaurantEntity = await service.addMichelinStarRestaurant(newRestaurant.id, newMichelinStar.id);
    
    expect(result.michelinStars.length).toBe(1);
    expect(result.michelinStars[0]).not.toBeNull();
    expect(result.michelinStars[0].date).toBe(newMichelinStar.date);
  });

  it('addMichelinStarRestaurant should thrown exception for an invalid michelinStar', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.companyName(),
      city: faker.address.city()
    });

    await expect(() => service.addMichelinStarRestaurant(newRestaurant.id, "0")).rejects.toHaveProperty("message", "The michelinStar with the given id was not found");
  });

  it('addMichelinStarRestaurant should throw an exception for an invalid restaurant', async () => {
    const newMichelinStar: MichelinStarEntity = await michelinStarRepository.save({
      date: faker.date.recent()
    });

    await expect(() => service.addMichelinStarRestaurant("0", newMichelinStar.id)).rejects.toHaveProperty("message", "The restaurant with the given id was not found");
  });

  it('findMichelinStarByRestaurantIdMichelinStarId should return michelinStar by restaurant', async () => {
    const michelinStar: MichelinStarEntity = michelinStarsList[0];
    const storedMichelinStar: MichelinStarEntity = await service.findMichelinStarByRestaurantIdMichelinStarId(restaurant.id, michelinStar.id, )
    expect(storedMichelinStar).not.toBeNull();
    expect(storedMichelinStar.date).toBe(michelinStar.date);
  });

  it('findMichelinStarByRestaurantIdMichelinStarId should throw an exception for an invalid michelinStar', async () => {
    await expect(()=> service.findMichelinStarByRestaurantIdMichelinStarId(restaurant.id, "0")).rejects.toHaveProperty("message", "The michelinStar with the given id was not found"); 
  });

  it('findMichelinStarByRestaurantIdMichelinStarId should throw an exception for an invalid restaurant', async () => {
    const michelinStar: MichelinStarEntity = michelinStarsList[0]; 
    await expect(()=> service.findMichelinStarByRestaurantIdMichelinStarId("0", michelinStar.id)).rejects.toHaveProperty("message", "The restaurant with the given id was not found"); 
  });

  it('findMichelinStarByRestaurantIdMichelinStarId should throw an exception for an michelinStar not associated to the restaurant', async () => {
    const newMichelinStar: MichelinStarEntity = await michelinStarRepository.save({
      date: faker.date.recent()
    });

    await expect(()=> service.findMichelinStarByRestaurantIdMichelinStarId(restaurant.id, newMichelinStar.id)).rejects.toHaveProperty("message", "The michelinStar with the given id is not associated to the restaurant"); 
  });

  it('findMichelinStarsByRestaurantId should return michelinStars by restaurant', async ()=>{
    const michelinStars: MichelinStarEntity[] = await service.findMichelinStarsByRestaurantId(restaurant.id);
    expect(michelinStars.length).toBe(5);
  });

  it('findMichelinStarsByRestaurantId should throw an exception for an invalid restaurant', async () => {
    await expect(()=> service.findMichelinStarsByRestaurantId("0")).rejects.toHaveProperty("message", "The restaurant with the given id was not found"); 
  });

  it('associateMichelinStarsRestaurant should update michelinStars list for a restaurant', async () => {
    const newMichelinStar: MichelinStarEntity = await michelinStarRepository.save({
      date: faker.date.recent()
    });

    const updatedRestaurant: RestaurantEntity = await service.associateMichelinStarsRestaurant(restaurant.id, [newMichelinStar]);
    expect(updatedRestaurant.michelinStars.length).toBe(1);

    expect(updatedRestaurant.michelinStars[0].date).toBe(newMichelinStar.date);
  });

  it('associateMichelinStarsRestaurant should throw an exception for an invalid restaurant', async () => {
    const newMichelinStar: MichelinStarEntity = await michelinStarRepository.save({
      date: faker.date.recent()
    });

    await expect(()=> service.associateMichelinStarsRestaurant("0", [newMichelinStar])).rejects.toHaveProperty("message", "The restaurant with the given id was not found"); 
  });

  it('associateMichelinStarsRestaurant should throw an exception for an invalid michelinStar', async () => {
    const newMichelinStar: MichelinStarEntity = michelinStarsList[0];
    newMichelinStar.id = "0";

    await expect(()=> service.associateMichelinStarsRestaurant(restaurant.id, [newMichelinStar])).rejects.toHaveProperty("message", "The michelinStar with the given id was not found"); 
  });

  it('deleteMichelinStarToRestaurant should remove an michelinStar from a restaurant', async () => {
    const michelinStar: MichelinStarEntity = michelinStarsList[0];
    
    await service.deleteMichelinStarRestaurant(restaurant.id, michelinStar.id);

    const storedRestaurant: RestaurantEntity = await restaurantRepository.findOne({where: {id: restaurant.id}, relations: ["michelinStars"]});
    const deletedMichelinStar: MichelinStarEntity = storedRestaurant.michelinStars.find(a => a.id === michelinStar.id);

    expect(deletedMichelinStar).toBeUndefined();

  });

  it('deleteMichelinStarToRestaurant should thrown an exception for an invalid michelinStar', async () => {
    await expect(()=> service.deleteMichelinStarRestaurant(restaurant.id, "0")).rejects.toHaveProperty("message", "The michelinStar with the given id was not found"); 
  });

  it('deleteMichelinStarToRestaurant should thrown an exception for an invalid restaurant', async () => {
    const michelinStar: MichelinStarEntity = michelinStarsList[0];
    await expect(()=> service.deleteMichelinStarRestaurant("0", michelinStar.id)).rejects.toHaveProperty("message", "The restaurant with the given id was not found"); 
  });

  it('deleteMichelinStarToRestaurant should thrown an exception for an non asocciated michelinStar', async () => {
    const newMichelinStar: MichelinStarEntity = await michelinStarRepository.save({
      date: faker.date.recent()
    });

    await expect(()=> service.deleteMichelinStarRestaurant(restaurant.id, newMichelinStar.id)).rejects.toHaveProperty("message", "The michelinStar with the given id is not associated to the restaurant"); 
  }); 
});
