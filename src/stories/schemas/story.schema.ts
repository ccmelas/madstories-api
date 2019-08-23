import { Schema } from 'mongoose';

const StorySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        required: true,
    },
    summary: {
        type: String
    },
    content: {
        type: String,
        required: true,
    },
    // TODO: Find out why [String] doesn't work for tests
    tags: [Object],
});

export { StorySchema };