import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Constants } from '../constants';
import { Story } from './interfaces/story.interface';
import { CreateStoryDto } from './dto/create-story.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StoriesService {
    constructor(@InjectModel(Constants.STORY_MODEL) private readonly story: Model<Story>) {}

    /**
     * Creates a new story
     * @param createStoryDto 
     */
    async create(createStoryDto: CreateStoryDto): Promise<Story> {
        return await this.story.create(createStoryDto);
    }

    /**
     * Returns a list of stories
     */
    async findAll(): Promise<Story[]> {
        return await this.story.find({});
    }
}
