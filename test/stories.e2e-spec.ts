import { TestingModule, Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { Model, Types } from 'mongoose';

import { AppModule } from "../src/app/app.module";
import { ResponseInterceptor } from "../src/common/interceptors/response.interceptor";
import { story, stories } from './data/index';
import { getModelToken } from "@nestjs/mongoose";
import { Constants } from "../src/constants";

describe('StoriesController', () => {
    let app: INestApplication;
    let storyModel: Model;
    let dbStories;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix("/api");
        app.useGlobalInterceptors(new ResponseInterceptor());
        storyModel = app.get(getModelToken(Constants.STORY_MODEL));
        await app.init();
        dbStories = await storyModel.create(stories);
    });

    afterEach(async () => {
        await storyModel.deleteMany({});
    });

    describe('GET /api/stories', () => {
        it('It successfully calls the stories route', async () => {
            const response = await request(app.getHttpServer())
                .get("/api/stories")
                .expect(200);
            expect(response.body.data.length).toBe(stories.length);
        });    
    });

    describe('GET /api/stories/:id', () => {
        it('successfully returns an existing story', async () => {
            const expectedStory = dbStories[0];
            const response = await request(app.getHttpServer())
                                .get(`/api/stories/${expectedStory._id}`)
                                .expect(200);
            expect(response.body.data._id).toEqual(expectedStory._id.toString());
            expect(response.body.data.title).toEqual(expectedStory.title);
        });

        it('returns a 404 when an invalid object id is passed', () => {
            return request(app.getHttpServer())
                                .get(`/api/stories/12345`)
                                .expect(404);
        });
        it('returns a 404 when an valid object id is passed but story is not found', () => {
            const id = (new Types.ObjectId()).toString();
            return request(app.getHttpServer())
                                .get(`/api/stories/${id}`)
                                .expect(404);
        });
    });
    
    describe('POST /api/stories', () => {
        it('Can successfully create a new story given the right data', async () => {
            const res = await request(app.getHttpServer())
                .post("/api/stories")
                .send(story)
                .expect(201);
            expect(res.body.data).toMatchObject(story);
            expect(res.body.data._id).toBeTruthy();
            const dbStories = await storyModel.find({});
            expect(dbStories.length).toEqual(stories.length + 1);
        });

        it('Throws validation error when wrong data is passed', async () => {
            const wrongStoryData = { ...story, title: null };
            const res = await request(app.getHttpServer())
                .post("/api/stories")
                .send(wrongStoryData)
                .expect(422);
            expect(res.body.errors).toBeTruthy();
            expect(res.body.errors.length).toBe(1);
            expect(res.body.errors[0].property).toBe('title');
            const dbStories = await storyModel.find({});
            expect(dbStories.length).toEqual(stories.length);
        });
    });
    
    describe('PATCH /api/stories/:id', () => {
        it('should successfully update an existing story given the right data', async () => {
            const storyToUpdate = dbStories[0];
            const update = { title: 'Updated Title' };
            const res = await request(app.getHttpServer())
                .patch(`/api/stories/${ storyToUpdate._id }`)
                .send(update)
                .expect(200);

            expect(res.body.data.title).toEqual(update.title);
            expect(res.body.data.content).toEqual(storyToUpdate.content);
            const updatedStory = await storyModel.findById(storyToUpdate._id);
            expect(updatedStory.title).toEqual(update.title);
        });


        it('returns a 404 when an invalid object id is passed', () => {
            return request(app.getHttpServer())
                                .patch(`/api/stories/12345`)
                                .expect(404);
        });
    });

    describe('PATCH /api/stories/:id/publish', () => {
        it('should successfully publish an existing story', async () => {
            const storyToPublish = dbStories[0];
            const res = await request(app.getHttpServer())
                .patch(`/api/stories/${ storyToPublish._id }/publish`)
                .send()
                .expect(200);

            expect(res.body.data.publishedAt).toBeTruthy();
            const publishedStory = await storyModel.findById(storyToPublish._id);
            expect(publishedStory.publishedAt).toBeTruthy();
        });


        it('returns a 404 when an invalid object id is passed', () => {
            return request(app.getHttpServer())
                                .patch(`/api/stories/12345/publish`)
                                .expect(404);
        });
    });


    describe('DELETE /api/stories/:id', () => {
        it('should successfully delete an existing story', async () => {
            const storyToDelete = dbStories[0];
            await request(app.getHttpServer())
                .delete(`/api/stories/${ storyToDelete._id }`)
                .expect(204);
            const deletedStory = await storyModel.findById(storyToDelete._id);
            expect(deletedStory).toBeNull();
            const storiesRemaining = await storyModel.find({});
            expect(storiesRemaining.length).toEqual(dbStories.length - 1);
        });


        it('returns a 404 when an invalid object id is passed', () => {
            return request(app.getHttpServer())
                                .delete(`/api/stories/12345`)
                                .expect(404);
        });
    });
});