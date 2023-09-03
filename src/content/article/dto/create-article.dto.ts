import { IsNumber, IsString } from "class-validator";

export class CreateArticleDto {
    @IsString()
    name: string;

    @IsString()
    title: string

    @IsString()
    text: string

    @IsString()
    description: string

    @IsString()
    authorId: string
}