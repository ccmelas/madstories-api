import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Constants } from '../constants';
import { Story } from './interfaces/story.interface';
import { CreateStoryDto } from './dto/create-story.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateStoryDto } from './dto/update-story.dto';

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

    /**
     * Returns a single story
     * @param id 
     */
    async findOne(id: string): Promise<Story> {
        return await this.story.findById(id);
    }

    /**
     * Updates a story
     * @param id 
     * @param updateStoryDto 
     */
    async update(id: string, updateStoryDto: UpdateStoryDto): Promise<Story> {
        return await this.story.findByIdAndUpdate(id, updateStoryDto, { new: true });
    }

    /**
     * Deletes a story
     * @param id 
     */
    async delete(id: string): Promise<any> {
        return await this.story.findByIdAndDelete(id);
    }
}
