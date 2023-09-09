import { AuthorRole } from "@prisma/client";
import { IsString } from "class-validator";

export class CreateAuthorDto {

    @IsString()
    name:     string;

    @IsString()
    surname:  string;

    @IsString()
    jobTitle: string;

    @IsString()
    type: AuthorRole
}