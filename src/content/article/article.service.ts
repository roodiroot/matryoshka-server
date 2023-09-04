import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateArticleDto } from '@article/dto';
import { AuthorService } from '@author/author.service';
import { FilesService } from '@files/files.service';

@Injectable()
export class ArticleService {
    constructor(
        private prismaService: PrismaService, 
        private authorService: AuthorService,
        private filesService: FilesService
        ){}

    async create(dto: CreateArticleDto, files: Array<Express.Multer.File>){
        if(isNaN(Number(dto.authorId))){
            throw new BadRequestException('Не верный формат authorId')
        }

        const author = await this.authorService.findOne(Number(dto.authorId))
        if(!author){
            throw new BadRequestException(`Автора с id = ${dto.authorId} не существует`)
        }
        const examinationArticle = await this.findOne(dto.name)
        if(examinationArticle){
            throw new BadRequestException(`Статья с name = ${dto.name} уже существует`)
        }
        const text = await this.filesService.createArrayFilesAndReplaceText(files, dto.text)
        if(!text){
            throw new BadRequestException('Не получилось переделать текст')
        }

        const article = this.prismaService.article.create({
            data: {
                name: dto.name,
                title: dto.title,
                text: text,
                description: dto.description,
                authorId: Number(dto.authorId)
            }
        })
        return article
    }

    async findAll(){
        const articles = await this.prismaService.article.findMany({include: {author: true}})
        return articles
    }

    async findOne(idOrName: string){
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

        // УДАЛИТЬ ПРОЕКТ ПО ID
    async drop(id: number){
        const article = await this.findOne(String(id))
        if(!article){
            return null
        }
        const dropArticle = await this.prismaService.article.delete({
            where: {id}
        })
        return dropArticle
    }
}
