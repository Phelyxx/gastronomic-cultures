import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { RestaurantEntity } from '../restaurant/restaurant.entity';

@Injectable()
export class GastronomicCultureRestaurantService {
    constructor(
        @InjectRepository(GastronomicCultureEntity)
        private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
     
        @InjectRepository(RestaurantEntity)
        private readonly restaurantRepository: Repository<RestaurantEntity>
    ) {}

    async addRestaurantGastronomicCulture(gastronomicCultureId: string, restaurantId: string): Promise<GastronomicCultureEntity> {
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}});
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND);
       
        const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}, relations: ["restaurants", "countries", "products", "recipes"]}) 
        if (!gastronomicCulture)
          throw new BusinessLogicException("The gastronomicCulture with the given id was not found", BusinessError.NOT_FOUND);
     
        gastronomicCulture.restaurants = [...gastronomicCulture.restaurants, restaurant];
        return await this.gastronomicCultureRepository.save(gastronomicCulture);
      }
     
    async findRestaurantByGastronomicCultureIdRestaurantId(gastronomicCultureId: string, restaurantId: string): Promise<RestaurantEntity> {
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}});
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND)
        
        const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}, relations: ["restaurants"]}); 
        if (!gastronomicCulture)
          throw new BusinessLogicException("The gastronomicCulture with the given id was not found", BusinessError.NOT_FOUND)
    
        const gastronomicCultureRestaurant: RestaurantEntity = gastronomicCulture.restaurants.find(e => e.id === restaurant.id);
    
        if (!gastronomicCultureRestaurant)
          throw new BusinessLogicException("The restaurant with the given id is not associated to the gastronomicCulture", BusinessError.PRECONDITION_FAILED)
    
        return gastronomicCultureRestaurant;
    }
     
    async findRestaurantsByGastronomicCultureId(gastronomicCultureId: string): Promise<RestaurantEntity[]> {
        const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}, relations: ["restaurants"]});
        if (!gastronomicCulture)
          throw new BusinessLogicException("The gastronomicCulture with the given id was not found", BusinessError.NOT_FOUND)
        
        return gastronomicCulture.restaurants;
    }
     
    async associateRestaurantsGastronomicCulture(gastronomicCultureId: string, restaurants: RestaurantEntity[]): Promise<GastronomicCultureEntity> {
        const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}, relations: ["restaurants"]});
     
        if (!gastronomicCulture)
          throw new BusinessLogicException("The gastronomicCulture with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < restaurants.length; i++) {
          const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurants[i].id}});
          if (!restaurant)
            throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        gastronomicCulture.restaurants = restaurants;
        return await this.gastronomicCultureRepository.save(gastronomicCulture);
      }
     
    async deleteRestaurantGastronomicCulture(gastronomicCultureId: string, restaurantId: string){
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}});
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND)
     
        const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}, relations: ["restaurants"]});
        if (!gastronomicCulture)
          throw new BusinessLogicException("The gastronomicCulture with the given id was not found", BusinessError.NOT_FOUND)
     
        const gastronomicCultureRestaurant: RestaurantEntity = gastronomicCulture.restaurants.find(e => e.id === restaurant.id);
     
        if (!gastronomicCultureRestaurant)
            throw new BusinessLogicException("The restaurant with the given id is not associated to the gastronomicCulture", BusinessError.PRECONDITION_FAILED)

        gastronomicCulture.restaurants = gastronomicCulture.restaurants.filter(e => e.id !== restaurantId);
        await this.gastronomicCultureRepository.save(gastronomicCulture);
    }   
}
