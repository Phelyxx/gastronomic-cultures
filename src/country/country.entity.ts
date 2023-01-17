import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class CountryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany(() => GastronomicCultureEntity, gastronomicCulture => gastronomicCulture.countries)
    gastronomicCultures: GastronomicCultureEntity[];
}
