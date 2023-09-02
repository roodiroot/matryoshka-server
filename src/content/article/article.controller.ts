import { Body, Controller, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ArticleService } from '@article/article.service';
import { CreateArticleDto } from '@article/dto';
import { RolesGuard } from '@auth/guards/role.guard';
import { Public, Roles } from '@common/decorators';
import { Role } from '@prisma/client';

@Controller('article')
export class ArticleController {
    constructor(private articleService: ArticleService){}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    async create(@Body(new ValidationPipe()) dto: CreateArticleDto){
        const article = await this.articleService.createArticle(dto)
        return article
    }

    @Public()
    @Get()
    async findAll(){
        const articles = await this.articleService.findAllArticle()
        return articles
    }

    @Public()
    @Get(":idOrName")
    async findOne(@Param("idOrName") idOrName: string){
        const article = await this.articleService.finOneArticle(idOrName)
        return article
    }


}
