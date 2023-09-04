import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ArticleService } from '@article/article.service';
import { CreateArticleDto } from '@article/dto';
import { RolesGuard } from '@auth/guards/role.guard';
import { Public, Roles } from '@common/decorators';
import { Role } from '@prisma/client';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('article')
export class ArticleController {
    constructor(private articleService: ArticleService){}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(AnyFilesInterceptor())
    @Post()
    async createArticle(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({fileType: '.(png|jpeg|jpg)'}),
                    new MaxFileSizeValidator({ maxSize: 2600000 }),
                ]
              })
        ) files: Array<Express.Multer.File>, 
        @Body() dto: CreateArticleDto
        ){
        const article = await this.articleService.create(dto, files)
        return article
    }

    @Public()
    @Get()
    async findAllArticle(){
        const articles = await this.articleService.findAll()
        return articles
    }

    @Public()
    @Get(":idOrName")
    async findOneArticle(@Param("idOrName") idOrName: string){
        const article = await this.articleService.findOne(idOrName)
        return article
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(":id")
    async deleteProject(@Param("id") id: string){
        if(isNaN(Number(id))){
            throw new BadRequestException('Не верный формат id')
        }
        return await this.articleService.drop(Number(id))
    }
}
