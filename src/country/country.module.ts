import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from './country.entity';
import { CountryService } from './country.service';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity])],
  providers: [CountryService]
})
export class CountryModule {}
