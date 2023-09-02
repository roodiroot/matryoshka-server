import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateArticleDto } from '@article/dto';
import { AuthorService } from '@author/author.service';
import { Article } from '@prisma/client';
import { isObject } from 'class-validator';


@Injectable()
export class ArticleService {
    constructor(
        private prismaService: PrismaService, 
        private authorService: AuthorService
        ){}

    async createArticle(dto: CreateArticleDto){
        const author = await this.authorService.findAuthor(dto.authorId)
        if(!author){
            throw new BadRequestException(`Автора с id = ${dto.authorId} не существует`)
        }
        const article = this.prismaService.article.create({
            data: {
                name: dto.name,
                title: dto.title,
                text: dto.text,
                description: dto.description,
                authorId: dto.authorId
            }
        })
        return article
    }

    async findAllArticle(){
        const articles = await this.prismaService.article.findMany(
            {
                include: {author: true}
            }
            )
        return articles
    }

    async finOneArticle(idOrName: string){
    const article = await this.prismaService.article.findFirst({ where: {
        OR: [{id: isNaN(Number(idOrName)) ? 0 : Number(idOrName)}, {name: idOrName}]
    }, include: {
        author: true
    }})
    if(!article){
        return null
    }
    return article
    }
}
