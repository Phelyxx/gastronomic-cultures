import { MichelinStarEntity } from "../michelinstar/michelinstar.entity"; 
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { Column, Entity, OneToMany, ManyToMany, PrimaryGeneratedColumn  } from "typeorm";

@Entity()
export class RestaurantEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    name: string;

    @Column()
    city: string;

    @OneToMany(() => MichelinStarEntity, michelinStar => michelinStar.restaurant)
    michelinStars: MichelinStarEntity[];

    @ManyToMany(() => GastronomicCultureEntity, gastronomicCulture => gastronomicCulture.restaurants)
    gastronomicCultures: GastronomicCultureEntity[];
}
