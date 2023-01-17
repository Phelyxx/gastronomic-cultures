import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MichelinStarEntity } from './michelinstar.entity';
import { MichelinStarService } from './michelinstar.service';

import { faker } from '@faker-js/faker';

describe('MichelinStarService', () => {
  let service: MichelinStarService;
  let repository: Repository<MichelinStarEntity>;
  let michelinStarsList: MichelinStarEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MichelinStarService],
    }).compile();

    service = module.get<MichelinStarService>(MichelinStarService);
    repository = module.get<Repository<MichelinStarEntity>>(getRepositoryToken(MichelinStarEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    michelinStarsList = [];
    for(let i = 0; i < 5; i++){
      const michelinStar: MichelinStarEntity = await repository.save({
        date: faker.date.recent()})
      michelinStarsList.push(michelinStar);
    };
  }

  it('findAll should return all michelinStars', async () => {
    const michelinStars: MichelinStarEntity[] = await service.findAll();
    expect(michelinStars).not.toBeNull();
    expect(michelinStars).toHaveLength(michelinStarsList.length);
  });

  it('findOne should return a michelinStar by id', async () => {
    const storedMichelinStar: MichelinStarEntity = michelinStarsList[0];
    const michelinStar: MichelinStarEntity = await service.findOne(storedMichelinStar.id);
    expect(michelinStar).not.toBeNull();
    expect(michelinStar.date).toEqual(storedMichelinStar.date);
    expect(michelinStar.restaurant).toEqual(storedMichelinStar.restaurant);
  });

  it('findOne should throw an exception for an invalid michelinStar', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The michelinStar with the given id was not found")
  });

  it('create should return a new michelinStar', async () => {
    const michelinStar: MichelinStarEntity = {
      id: "",
      date: faker.date.recent(),
      restaurant: null
    }

    const newMichelinStar: MichelinStarEntity = await service.create(michelinStar);
    expect(newMichelinStar).not.toBeNull();

    const storedMichelinStar: MichelinStarEntity = await repository.findOne({where: {id: newMichelinStar.id}})
    expect(michelinStar).not.toBeNull();
    expect(michelinStar.date).toEqual(storedMichelinStar.date)
  });

  it('update should modify a michelinStar', async () => {
    const michelinStar: MichelinStarEntity = michelinStarsList[0];
    michelinStar.date = new Date();
    const updatedMichelinStar: MichelinStarEntity = await service.update(michelinStar.id, michelinStar);
    expect(updatedMichelinStar).not.toBeNull();
    const storedMichelinStar: MichelinStarEntity = await repository.findOne({where:{id: michelinStar.id}})
    expect(storedMichelinStar).not.toBeNull();
    expect(storedMichelinStar.date).toEqual(michelinStar.date)
  });

  it('update should throw an exception for an invalid michelinStar', async () => {
    let michelinStar: MichelinStarEntity = michelinStarsList[0];
    michelinStar = {
      ...michelinStar, date: new Date()
    }
    await expect(() => service.update("0", michelinStar)).rejects.toHaveProperty("message", "The michelinStar with the given id was not found")
  });

  it('delete should remove a michelinStar', async () => {
    const michelinStar: MichelinStarEntity = michelinStarsList[0];
    await service.delete(michelinStar.id);
     const deletedMichelinStar: MichelinStarEntity = await repository.findOne({ where: { id: michelinStar.id } })
    expect(deletedMichelinStar).toBeNull();
  });

  it('delete should throw an exception for an invalid michelinStar', async () => {
    const michelinStar: MichelinStarEntity = michelinStarsList[0];
    await service.delete(michelinStar.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The michelinStar with the given id was not found")
  });
});
