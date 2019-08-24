import { Controller, Post, Body, Get, Param, NotFoundException, UsePipes, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { Story } from './interfaces/story.interface';
import { StoriesService } from './stories.service';
import { ValidateObjectIdPipe } from '../common/pipes/validate-object-id.pipe';
import { ValidatorPipe } from '../common/pipes/validator.pipe';
import { UpdateStoryDto } from './dto/update-story.dto';

@Controller('stories')
export class StoriesController {
    constructor(private readonly storiesService: StoriesService){}

    @Post()
    @UsePipes(new ValidatorPipe())
    async create(@Body() createStoryDto: CreateStoryDto): Promise<Story> {
        return this.storiesService.create(createStoryDto);
    }

    @Get()
    async index(): Promise<Story[]> {
        return this.storiesService.findAll();
    }

    @Get(':id')
    async show(@Param('id', new ValidateObjectIdPipe()) id: string): Promise<Story> {
        const story = await this.storiesService.findOne(id);
        if (!story) throw new NotFoundException('Story not found');
        return story;
    }

    @Patch(':id')
    @UsePipes(new ValidatorPipe())
    async update(@Param('id', new ValidateObjectIdPipe()) id: string, @Body() updateStoryDto: UpdateStoryDto): Promise<Story> {
        const story = await this.storiesService.update(id, updateStoryDto);
        if (!story) throw new NotFoundException('Story not found');
        return story;
    }

    @Patch(':id/publish')
    async publish(@Param('id', new ValidateObjectIdPipe()) id: string): Promise<Story> {
        const story = await this.storiesService.update(id, { publishedAt: Date.now() });
        if (!story) throw new NotFoundException('Story not found');
        return story;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', new ValidateObjectIdPipe()) id: string): Promise<any> {
        return await this.storiesService.delete(id);
    }
}
