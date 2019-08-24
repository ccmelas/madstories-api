import { Test } from "@nestjs/testing";

import { StoriesController } from "./stories.controller";
import { StoriesService } from "./stories.service";
import { getModelToken } from "@nestjs/mongoose";
import { Constants } from "../constants";
import { story } from '../../test/data/index';

class StoryModelMock {}

/**
 * Mock date.now
 */
const publishedAt = 123456;
Date.now = jest.fn(() => publishedAt);

describe('StoriesController', () => {
   let storiesController: StoriesController;
   let storiesService: StoriesService;
   
   beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [StoriesController],
            providers: [
                { 
                   provide: StoriesService, 
                   useFactory: () => ({
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(() => true),
                        update: jest.fn(() => true),
                        delete: jest.fn(),
                    })
                }, 
                { provide: getModelToken(Constants.STORY_MODEL), useClass: StoryModelMock }
            ],
       }).compile();
       storiesService = module.get<StoriesService>(StoriesService);
       storiesController = module.get<StoriesController>(StoriesController);
   });

   describe('index', () => {
        it('should correctly call the storiesService "findAll" method', async () => {
            await storiesController.index();
            expect(storiesService.findAll).toHaveBeenCalled();
            expect(storiesService.findAll).toHaveBeenCalledWith();
        });
   });

   describe('create', () => {
        it('should correctly call the storiesService "create" method', async () => {
            await storiesController.create(story);
            expect(storiesService.create).toHaveBeenCalled();
            expect(storiesService.create).toHaveBeenCalledWith(story);
        });
    });

    describe('show', () => {
        it('should correctly call the storiesService "findOne" method', async () => {
            const id = "12345";
            await storiesController.show(id);
            expect(storiesService.findOne).toHaveBeenCalled();
            expect(storiesService.findOne).toHaveBeenCalledWith(id);
        });
    });

    describe('update', () => {
        it('should correctly call the storiesService "update" method', async () => {
            const id = "12345", updateData = { title: "New title" };
            await storiesController.update(id, updateData);
            expect(storiesService.update).toHaveBeenCalled();
            expect(storiesService.update).toHaveBeenCalledWith(id, updateData);
        });
    });

    describe('delete', () => {
        it('should correctly call the storiesService "delete" method', async () => {
            const id = "12345";
            await storiesController.delete(id);
            expect(storiesService.delete).toHaveBeenCalled();
            expect(storiesService.delete).toHaveBeenCalledWith(id);
        });
    });

    describe('publish', () => {
        it('should correctly call the storiesService "update" method', async () => {
            const id = "12345";
            await storiesController.publish(id);
            expect(storiesService.update).toHaveBeenCalled();
            expect(storiesService.update).toHaveBeenCalledWith(id, { publishedAt });
        });
    });
});