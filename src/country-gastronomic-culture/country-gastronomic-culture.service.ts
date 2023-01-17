/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryEntity } from '../country/country.entity';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';

import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CountryGastronomicCultureService {
    constructor(
        @InjectRepository(CountryEntity)
        private readonly countryRepository: Repository<CountryEntity>,
     
        @InjectRepository(GastronomicCultureEntity)
        private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>
    ) {}

    async addGastronomicCultureCountry(countryId: string, gastronomicCultureId: string): Promise<CountryEntity> {
        const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}});
        if (!gastronomicCulture)
          throw new BusinessLogicException("The gastronomic Culture with the given id was not found", BusinessError.NOT_FOUND);
       
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["gastronomicCultures"]}) 
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND);
     
        country.gastronomicCultures = [...country.gastronomicCultures, gastronomicCulture];
        return await this.countryRepository.save(country);
      }
     
    async findGastronomicCultureByCountryIdGastronomicCultureId(countryId: string, gastronomicCultureId: string): Promise<GastronomicCultureEntity> {
        const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}});
        if (!gastronomicCulture)
          throw new BusinessLogicException("The gastronomicCulture with the given id was not found", BusinessError.NOT_FOUND)
        
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["gastronomicCultures"]}); 
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)
    
        const countryGastronomicCulture: GastronomicCultureEntity = country.gastronomicCultures.find(e => e.id === gastronomicCulture.id);
    
        if (!countryGastronomicCulture)
          throw new BusinessLogicException("The gastronomic Culture with the given id is not associated to the country", BusinessError.PRECONDITION_FAILED)
    
        return countryGastronomicCulture;
    }
     
    async findGastronomicCulturesByCountryId(countryId: string): Promise<GastronomicCultureEntity[]> {
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["gastronomicCultures"]});
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)
        
        return country.gastronomicCultures;
    }
     
    async associateGastronomicCulturesCountry(countryId: string, gastronomicCultures: GastronomicCultureEntity[]): Promise<CountryEntity> {
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["gastronomicCultures"]});
     
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < gastronomicCultures.length; i++) {
          const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultures[i].id}});
          if (!gastronomicCulture)
            throw new BusinessLogicException("The gastronomic Culture with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        country.gastronomicCultures = gastronomicCultures;
        return await this.countryRepository.save(country);
      }
     
    async deleteGastronomicCultureCountry(countryId: string, gastronomicCultureId: string){
        const gastronomicCulture: GastronomicCultureEntity = await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}});
        if (!gastronomicCulture)
          throw new BusinessLogicException("The gastronomic Culture with the given id was not found", BusinessError.NOT_FOUND)
     
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["gastronomicCultures"]});
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)
     
        const countryGastronomicCulture: GastronomicCultureEntity = country.gastronomicCultures.find(e => e.id === gastronomicCulture.id);
     
        if (!countryGastronomicCulture)
            throw new BusinessLogicException("The gastronomic Culture with the given id is not associated to the country", BusinessError.PRECONDITION_FAILED)

        country.gastronomicCultures = country.gastronomicCultures.filter(e => e.id !== gastronomicCultureId);
        await this.countryRepository.save(country);
    }   
}
