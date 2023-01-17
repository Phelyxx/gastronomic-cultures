import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from '../country/country.entity';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { CountryGastronomicCultureService } from './country-gastronomic-culture.service';


@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity, GastronomicCultureEntity])],
  providers: [CountryGastronomicCultureService]
})
export class CountryGastronomicCultureModule {}
