import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports:[
    TypeOrmModule.forFeature([
      Post,PostImage
    ])
  ],
  exports:[
    PostService,
    TypeOrmModule
  ]
})
export class PostModule {}
