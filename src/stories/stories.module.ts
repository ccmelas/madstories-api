import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorySchema } from './schemas/story.schema';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { Constants } from '../constants';

@Module({
    imports: [MongooseModule.forFeature([{ name: Constants.STORY_MODEL, schema: StorySchema }])],
    providers: [StoriesService],
    controllers: [StoriesController],
})
export class StoriesModule {}
