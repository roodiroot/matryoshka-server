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
    async create(@Body() dto: CreateAuthorDto){
        return await this.authorService.createAuthor(dto)
    }

    @Public()
    @Get()
    async getAll(){
        return await this.authorService.getAllAuthor()
    }
}
