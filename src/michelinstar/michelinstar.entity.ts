/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity';

@Entity()
export class MichelinStarEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @ManyToOne(() => RestaurantEntity, restaurant => restaurant.michelinStars)
    restaurant: RestaurantEntity;
}
