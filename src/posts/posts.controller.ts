import { JwtAuthGuard } from './../auth/guards/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { Res } from '@nestjs/common/decorators';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Res() res,
    @Body() createPostDto: CreatePostDto,
    @User('id') userId,
  ) {
    const newPost = await this.postsService.create(createPostDto, userId);
    return res.status(HttpStatus.OK).json({
      message: 'Post has been created',
      post: newPost,
    });
  }

  @Get()
  async findAll(@Res() res) {
    const posts = await this.postsService.findAll();
    return res.status(HttpStatus.OK).json(posts);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
