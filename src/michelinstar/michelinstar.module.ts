import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MichelinStarService } from './michelinstar.service';
import { MichelinStarEntity } from './michelinstar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MichelinStarEntity])],
  providers: [MichelinStarService]
})
export class MichelinStarModule {}
