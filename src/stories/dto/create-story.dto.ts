import { IsString, IsArray } from "class-validator";

export class CreateStoryDto {
    @IsString() readonly title: string;
    @IsString() readonly summary: string;
    @IsString() readonly content: string;
    @IsString() readonly banner: string;
    @IsArray()  readonly tags: string[];
}