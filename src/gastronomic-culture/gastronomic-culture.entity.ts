import { Column, Entity, JoinTable, OneToOne, PrimaryGeneratedColumn, OneToMany, ManyToMany} from 'typeorm';
import { RecipeEntity } from '../recipe/recipe.entity';
import { ProductEntity } from '../product/product.entity';
import { CountryEntity } from '../country/country.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';

@Entity()
export class GastronomicCultureEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
     name: string;

    @Column()
    description: string;


    @OneToMany(() => RecipeEntity, recipe=> recipe.gastronomic)
    recipes: RecipeEntity[];

    @OneToMany(() => ProductEntity, product=> product.gastronomicCulture)
    products: ProductEntity[];
    
    @ManyToMany(() => CountryEntity, country => country.gastronomicCultures)
    @JoinTable()
    countries: CountryEntity[];

    @ManyToMany(() => RestaurantEntity, restaurant => restaurant.gastronomicCultures)
    restaurants: RestaurantEntity[];
}
