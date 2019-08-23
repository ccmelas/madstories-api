import { Test } from "@nestjs/testing";
import { StoriesService } from "./stories.service";
import { getModelToken } from "@nestjs/mongoose";
import { Constants } from "../constants";
import { story } from '../../test/data/';

const storyId: string = 'xxxx';

const create = jest.fn().mockResolvedValueOnce(Promise.resolve({ ...story, _id: storyId }));
const find = jest.fn().mockReturnValueOnce([story]); 
const findById = jest.fn().mockReturnValueOnce(story); 
const findByIdAndUpdate = jest.fn().mockReturnValueOnce(story); 
const findByIdAndDelete = jest.fn(); 
const StoryModelMock = jest.fn().mockImplementation(() => ({
    create, find, findById, findByIdAndUpdate, findByIdAndDelete
}));

describe('StoriesService', () => {
    let storiesService: StoriesService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                StoriesService, 
                { 
                    provide: getModelToken(Constants.STORY_MODEL),
                    useClass: StoryModelMock,
                }
            ]
        }).compile();
        storiesService = module.get<StoriesService>(StoriesService);
    });

    describe('Method *create*', () => {
        it('should correctly invoke the model create method', async () => {
            expect(await storiesService.create(story)).toEqual({...story, _id: storyId });
            expect(create).toHaveBeenCalled();
            expect(create).toHaveBeenCalledWith(story);
        });
    });

    describe('Method *findAll*', () => {
        it('should correctly invoke the model find method', async () => {
            await storiesService.findAll();
            expect(find).toHaveBeenCalled();
        });
    });

    describe('Method *findOne*', () => {
        it('should correctly invoke the model find method', async () => {
            const id = "1234";
            await storiesService.findOne(id);
            expect(findById).toHaveBeenCalled();
            expect(findById).toHaveBeenCalledWith(id);
        });
    });

    describe('Method *update*', () => {
        it('should correctly invoke the model findByIdAndUpdate method', async () => {
            const id = "1234";
            const updateData = { title: "Hello world"};
            await storiesService.update(id, updateData);
            expect(findByIdAndUpdate).toHaveBeenCalled();
            expect(findByIdAndUpdate).toHaveBeenCalledWith(id, updateData, { new: true });
        });
    });

    describe('Method *delete*', () => {
        it('should correctly invoke the model findByIdAndDelete method', async () => {
            const id = "1234";
            await storiesService.delete(id);
            expect(findByIdAndDelete).toHaveBeenCalled();
            expect(findByIdAndDelete).toHaveBeenCalledWith(id);
        });
    });
});