import { Schema } from 'mongoose';

export const StorySchema = new Schema({
    title: {
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
    tags: [String],
});
