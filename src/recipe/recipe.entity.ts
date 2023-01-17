import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';

@Entity()
export class RecipeEntity {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    photo: string;

    @Column()
    preparation: string;

    @Column()
    video: string;

    @ManyToOne(() => GastronomicCultureEntity, gastronomic => gastronomic.recipes)
    gastronomic: GastronomicCultureEntity;


}
