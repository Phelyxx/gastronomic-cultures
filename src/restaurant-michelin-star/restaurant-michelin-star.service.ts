import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { MichelinStarEntity } from '../michelinstar/michelinstar.entity';

@Injectable()
export class RestaurantMichelinStarService {
    constructor(
        @InjectRepository(RestaurantEntity)
        private readonly restaurantRepository: Repository<RestaurantEntity>,

        @InjectRepository(MichelinStarEntity)
        private readonly michelinStarRepository: Repository<MichelinStarEntity>
    ){}

    async addMichelinStarRestaurant(restaurantId: string, michelinStarId: string): Promise<RestaurantEntity> {
        const michelinStar: MichelinStarEntity = await this.michelinStarRepository.findOne({where: {id: michelinStarId}});
        if (!michelinStar)
          throw new BusinessLogicException("The michelinStar with the given id was not found", BusinessError.NOT_FOUND);
      
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}, relations: ["michelinStars", "exhibitions"]})
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND);
    
        restaurant.michelinStars = [...restaurant.michelinStars, michelinStar];
        return await this.restaurantRepository.save(restaurant);
    }

    async findMichelinStarByRestaurantIdMichelinStarId(restaurantId: string, michelinStarId: string): Promise<MichelinStarEntity> {
        const michelinStar: MichelinStarEntity = await this.michelinStarRepository.findOne({where: {id: michelinStarId}});
        if (!michelinStar)
          throw new BusinessLogicException("The michelinStar with the given id was not found", BusinessError.NOT_FOUND)
       
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}, relations: ["michelinStars"]});
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND)
   
        const restaurantMichelinStar: MichelinStarEntity = restaurant.michelinStars.find(e => e.id === michelinStar.id);
   
        if (!restaurantMichelinStar)
          throw new BusinessLogicException("The michelinStar with the given id is not associated to the restaurant", BusinessError.PRECONDITION_FAILED)
   
        return restaurantMichelinStar;
    }
    
    async findMichelinStarsByRestaurantId(restaurantId: string): Promise<MichelinStarEntity[]> {
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}, relations: ["michelinStars"]});
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND)
       
        return restaurant.michelinStars;
    }
    
    async associateMichelinStarsRestaurant(restaurantId: string, michelinStars: MichelinStarEntity[]): Promise<RestaurantEntity> {
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}, relations: ["michelinStars"]});
    
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < michelinStars.length; i++) {
          const michelinStar: MichelinStarEntity = await this.michelinStarRepository.findOne({where: {id: michelinStars[i].id}});
          if (!michelinStar)
            throw new BusinessLogicException("The michelinStar with the given id was not found", BusinessError.NOT_FOUND)
        }
    
        restaurant.michelinStars = michelinStars;
        return await this.restaurantRepository.save(restaurant);
    }
    
    async deleteMichelinStarRestaurant(restaurantId: string, michelinStarId: string){
        const michelinStar: MichelinStarEntity = await this.michelinStarRepository.findOne({where: {id: michelinStarId}});
        if (!michelinStar)
          throw new BusinessLogicException("The michelinStar with the given id was not found", BusinessError.NOT_FOUND)
    
        const restaurant: RestaurantEntity = await this.restaurantRepository.findOne({where: {id: restaurantId}, relations: ["michelinStars"]});
        if (!restaurant)
          throw new BusinessLogicException("The restaurant with the given id was not found", BusinessError.NOT_FOUND)
    
        const restaurantMichelinStar: MichelinStarEntity = restaurant.michelinStars.find(e => e.id === michelinStar.id);
    
        if (!restaurantMichelinStar)
            throw new BusinessLogicException("The michelinStar with the given id is not associated to the restaurant", BusinessError.PRECONDITION_FAILED)
 
        restaurant.michelinStars = restaurant.michelinStars.filter(e => e.id !== michelinStarId);
        await this.restaurantRepository.save(restaurant);
    }
}
