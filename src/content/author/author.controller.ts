import { BadRequestException, Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateAuthorDto } from '@author/dto/create-author.dto';
import { AuthorService } from '@author/author.service';
import { RolesGuard } from '@auth/guards/role.guard';
import { Public, Roles } from '@common/decorators';
import { AuthorRole, Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('author')
export class AuthorController {
    constructor(private authorService: AuthorService){}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    @UseInterceptors(FileInterceptor('img'))
    async createAuthor(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({fileType: '.(png|jpeg|jpg)'}),
                    new MaxFileSizeValidator({ maxSize: 2600000 }),
                ]
              })
        ) img: Express.Multer.File,
        @Body() dto: CreateAuthorDto
        ){
        return await this.authorService.create(dto, img)
    }

    @Public()
    @Get(":id")
    async getAuthorById(@Param("id") id: string){
        if(isNaN(Number(id))){
            throw new BadRequestException('Не верный формат id')
        }
        return this.authorService.findOne(Number(id))
    }
    

    @Public()
    @Get()
    async getAllAuthor(@Query('type') type?: AuthorRole){
        return await this.authorService.getAll(type)
    }
}
