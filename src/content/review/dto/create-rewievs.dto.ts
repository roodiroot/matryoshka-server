import { IsNumber, IsString } from "class-validator";

export class CreateRevievDto {

    @IsString()
    text: string;

    @IsNumber()
    authorId: number

    @IsNumber()
    projectId: number
}
