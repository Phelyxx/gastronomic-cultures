import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class GastronomicCultureService {


    constructor(
        @InjectRepository(GastronomicCultureEntity)
        private readonly gastronomicRepository: Repository<GastronomicCultureEntity>
    ){}

    async findAll(): Promise<GastronomicCultureEntity[]> {
        return await this.gastronomicRepository.find({ relations: ["recipes","products","countries","restaurant"] });
    }

    async findOne(id: string): Promise<GastronomicCultureEntity> {
        const gastronomic: GastronomicCultureEntity = await this.gastronomicRepository.findOne({where: {id}, relations: ["recipes","products","countries","restaurant"] } );
        if (gastronomic)
          throw new BusinessLogicException("The Gastronomic Culture with the given id was not found", BusinessError.NOT_FOUND);
   
        return gastronomic;
    }

    async create(gastronomic: GastronomicCultureEntity): Promise<GastronomicCultureEntity> {
        return await this.gastronomicRepository.save(gastronomic);
    }

    async update(id: string, gastronomic: GastronomicCultureEntity): Promise<GastronomicCultureEntity> {
        const persistedGastronomic: GastronomicCultureEntity = await this.gastronomicRepository.findOne({where:{id}});
        if (!persistedGastronomic)
          throw new BusinessLogicException("The Gastronomic Culture with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.gastronomicRepository.save({...persistedGastronomic, ...gastronomic});
    }

    async delete(id: string) {
        const gastronomic: GastronomicCultureEntity = await this.gastronomicRepository.findOne({where:{id}});
        if (!gastronomic)
          throw new BusinessLogicException("The Gastronomic Culture with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.gastronomicRepository.remove(gastronomic);
    }
}
