import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateAuthorDto } from '@author/dto/create-author.dto';
import { AuthorService } from '@author/author.service';
import { RolesGuard } from '@auth/guards/role.guard';
import { Public, Roles } from '@common/decorators';
import { Role } from '@prisma/client';


@Controller('author')
export class AuthorController {
    constructor(private authorService: AuthorService){}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    async createAuthor(@Body() dto: CreateAuthorDto){
        return await this.authorService.create(dto)
    }

    @Public()
    @Get()
    async getAllAuthor(){
        return await this.authorService.getAll()
    }
}
