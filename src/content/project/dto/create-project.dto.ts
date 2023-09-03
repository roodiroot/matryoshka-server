import { Achieved, InfoProject, Review } from "@prisma/client";
import { ArrayContains, ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsNumber, IsString, Length } from "class-validator";

export class CreateProjectDto {

    @IsString()
    @Length(3, 30)
    name: string;

    @IsString()
    @Length(3, 50)
    teme: string;

    @IsString()
    @Length(3, 70)
    title: string;

    @IsString()
    @Length(3, 100)
    description: string;

    @IsString()
    @Length(500, 2500)
    article: string;
    

    
    
    @IsString()
    @Length(1, 100)
    authorId: string;

    @IsString()
    @Length(3, 300)
    text: string

    @ArrayMinSize(2)
    @ArrayMaxSize(6)
    stack: string[];
    
    @ArrayMinSize(3)
    @ArrayMaxSize(3)
    info: InfoProject[];

        
    @ArrayMinSize(2)
    @ArrayMaxSize(4)
    achieved: Achieved[];
}