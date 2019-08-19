import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { Story } from './interfaces/story.interface';
import { StoriesService } from './stories.service';

@Controller('stories')
export class StoriesController {
    constructor(private readonly storiesService: StoriesService){}

    @Post()
    async create(@Body() createStoryDto: CreateStoryDto): Promise<Story> {
        return this.storiesService.create(createStoryDto);
    }

    @Get()
    async index(): Promise<Story[]> {
        return this.storiesService.findAll();
    }
}
