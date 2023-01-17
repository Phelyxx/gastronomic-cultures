/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>
    ){}

    async findAll(): Promise<CategoryEntity[]> {
        return await this.categoryRepository.find({ relations: ["product"] });
    }

    async findOne(id: string): Promise<CategoryEntity> {
        const category: CategoryEntity = await this.categoryRepository.findOne({where: {id}, relations: ["product"] } );
        if (!category)
          throw new BusinessLogicException("The category with the given id was not found", BusinessError.NOT_FOUND);
   
        return category;
    }
    
    async create(category: CategoryEntity): Promise<CategoryEntity> {
        return await this.categoryRepository.save(category);
    }

    async update(id: string, category: CategoryEntity): Promise<CategoryEntity> {
        const persistedCategory: CategoryEntity = await this.categoryRepository.findOne({where:{id}});
        if (!persistedCategory)
          throw new BusinessLogicException("The category with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.categoryRepository.save({...persistedCategory, ...category});
    }

    async delete(id: string) {
        const category: CategoryEntity = await this.categoryRepository.findOne({where:{id}});
        if (!category)
          throw new BusinessLogicException("The category with the given id was not found", BusinessError.NOT_FOUND);
      
        await this.categoryRepository.remove(category);
    }
}
