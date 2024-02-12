import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostImage } from './entities/post-image.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports:[
    TypeOrmModule.forFeature([
      Post,PostImage
    ]),
    AuthModule
  ],
  exports:[
    PostService,
    TypeOrmModule
  ]
})
export class PostModule {}
