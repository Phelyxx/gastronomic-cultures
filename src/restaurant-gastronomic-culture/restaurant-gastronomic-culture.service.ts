import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RestaurantGastronomicCultureService {
    constructor(
        @InjectRepository(RestaurantEntity)
        private readonly restaurantRepository: Repository<RestaurantEntity>,
     
        @InjectRepository(GastronomicCultureEntity)
        private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>
    ) {}

    async addGastronomicCultureRestaurant(restaurantId: string, gastronomicCultureId: string): Promise<RestaurantEntity> {
        const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}});
        if (!gastronomicCulture)
          throw new BusinessLogicException("The gastronomic Culture with the given id was not found", BusinessError.NOT_FOUND);
       
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}, relations: ["michelinStars","gastronomicCultures"]}) 
        
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND);
     
        restaurant.gastronomicCultures = [...restaurant.gastronomicCultures, gastronomicCulture];
        return await this.restaurantRepository.save(restaurant);
      }
     
    async findGastronomicCultureByRestaurantIdGastronomicCultureId(restaurantId: string, gastronomicCultureId: string): Promise<GastronomicCultureEntity> {
        const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}});
        if (!gastronomicCulture)
          throw new BusinessLogicException("The gastronomicCulture with the given id was not found", BusinessError.NOT_FOUND)
        
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}, relations: ["gastronomicCultures"]}); 
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND)
    
        const restaurantGastronomicCulture: GastronomicCultureEntity = restaurant.gastronomicCultures.find(e => e.id === gastronomicCulture.id);
    
        if (!restaurantGastronomicCulture)
          throw new BusinessLogicException("The gastronomic Culture with the given id is not associated to the restaurant", BusinessError.PRECONDITION_FAILED)
    
        return restaurantGastronomicCulture;
    }
     
    async findGastronomicCulturesByRestaurantId(restaurantId: string): Promise<GastronomicCultureEntity[]> {
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}, relations: ["gastronomicCultures"]});
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND)
        
        return restaurant.gastronomicCultures;
    }
     
    async associateGastronomicCulturesRestaurant(restaurantId: string, gastronomicCultures: GastronomicCultureEntity[]): Promise<RestaurantEntity> {
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}, relations: ["gastronomicCultures"]});
     
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < gastronomicCultures.length; i++) {
          const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultures[i].id}});
          if (!gastronomicCulture)
            throw new BusinessLogicException("The gastronomic Culture with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        restaurant.gastronomicCultures = gastronomicCultures;
        return await this.restaurantRepository.save(restaurant);
      }
     
    async deleteGastronomicCultureRestaurant(restaurantId: string, gastronomicCultureId: string){
        const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}});
        if (!gastronomicCulture)
          throw new BusinessLogicException("The gastronomic Culture with the given id was not found", BusinessError.NOT_FOUND)
     
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}, relations: ["gastronomicCultures"]});
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND)
     
        const restaurantGastronomicCulture: GastronomicCultureEntity = restaurant.gastronomicCultures.find(e => e.id === gastronomicCulture.id);
     
        if (!restaurantGastronomicCulture)
            throw new BusinessLogicException("The gastronomic Culture with the given id is not associated to the restaurant", BusinessError.PRECONDITION_FAILED)

        restaurant.gastronomicCultures = restaurant.gastronomicCultures.filter(e => e.id !== gastronomicCultureId);
        await this.restaurantRepository.save(restaurant);
    }   
}
