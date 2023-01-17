import { Module } from '@nestjs/common';
import { GastronomicCultureService } from './gastronomic-culture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GastronomicCultureEntity])],
  providers: [GastronomicCultureService]
})
export class GastronomicCultureModule {}
