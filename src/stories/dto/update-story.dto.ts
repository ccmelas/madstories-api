import { IsString, IsArray, IsOptional } from "class-validator";

export class UpdateStoryDto {
    @IsOptional() @IsString() readonly title?: string;
    @IsOptional() @IsString() readonly summary?: string;
    @IsOptional() @IsString() readonly content?: string;
    @IsOptional() @IsString() readonly banner?: string;
    @IsOptional() @IsArray()  readonly tags?: string[];
}