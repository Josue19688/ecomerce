import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, ParseUUIDPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';


@ApiTags('Post')
@Controller('post')


export class PostController {
  constructor(private readonly postService: PostService) {}


  @Post()
  @ApiResponse({status:201,description:'Post was created', type:Post})
  @ApiResponse({status:400,description:'Bad Request'})
  @ApiResponse({status:403,description:'Forbidden Token related'})
  @Auth()
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user:User
    ) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  findAll(@Query() paginatioDto:PaginationDto) {
    return this.postService.findAll(paginatioDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Auth()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
   
    ) {
    return this.postService.update(id, updatePostDto);
  }


  
  @Put(':id')
  updateComments(
    @Param('id') id: string,
     @Body() updatePostDto: UpdatePostDto, 
     @GetUser() user:User) {
    return this.postService.updateComments(id, updatePostDto);
  }


  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
