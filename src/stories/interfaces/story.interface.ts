import { Document } from 'mongoose';

export class Story extends Document {
    readonly title: string;
    readonly summary: string;
    readonly content: string;
    readonly tags: string[];
}