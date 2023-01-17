import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { MichelinStarEntity } from './michelinstar.entity';

@Injectable()
export class MichelinStarService {
    constructor(
        @InjectRepository(MichelinStarEntity)
        private readonly michelinStarRepository: Repository<MichelinStarEntity>
    ){}

    async findAll(): Promise<MichelinStarEntity[]> {
        return await this.michelinStarRepository.find({ relations: ["restaurant"] });
    }

    async findOne(id: string): Promise<MichelinStarEntity> {
        const michelinStar: MichelinStarEntity = await this.michelinStarRepository.findOne( { where: {id}, relations: ["restaurant"] } );
        if (!michelinStar)
            throw new BusinessLogicException("The michelinStar with the given id was not found", BusinessError.NOT_FOUND);

        return michelinStar;
    }

    async create(michelinStar: MichelinStarEntity): Promise<MichelinStarEntity> {
        return await this.michelinStarRepository.save(michelinStar);
    }

    async update(id: string, michelinStar: MichelinStarEntity): Promise<MichelinStarEntity> {
        const persistedMichelinStar: MichelinStarEntity = await this.michelinStarRepository.findOne({where:{id}});
        if (!persistedMichelinStar)
          throw new BusinessLogicException("The michelinStar with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.michelinStarRepository.save({...persistedMichelinStar, ...michelinStar});
    }

    async delete(id: string) {
        const michelinStar: MichelinStarEntity = await this.michelinStarRepository.findOne({where:{id}});
        if (!michelinStar)
          throw new BusinessLogicException("The michelinStar with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.michelinStarRepository.remove(michelinStar);
    }
}
