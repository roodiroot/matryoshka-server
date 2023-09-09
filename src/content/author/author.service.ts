import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FilesService } from '@files/files.service';
import { AuthorRole } from '@prisma/client';

@Injectable()
export class AuthorService {
    constructor(
        private prismaService: PrismaService,
        private filesService: FilesService
        ){}

    async create(dto: CreateAuthorDto, img: Express.Multer.File){
        const fileName = await this.filesService.createFile(img)
        if(!fileName){
            throw new BadRequestException('Не удалось загрузить изображение')
        }
        if(dto.type !== AuthorRole.CLIENT && dto.type !== AuthorRole.TEAM){
            throw new BadRequestException('Не верный тип автора')
        }
        const author = await this.prismaService.author.create({
            data: {
                name: dto.name,
                surname: dto.surname,
                jobTitle: dto.jobTitle,
                type: dto.type,
                img: fileName,
            }
        })
        if(!author){
            throw new BadRequestException('Не удалось создать автора')
        }

        return author
    }

    async findOne(id: number){
        const author = await this.prismaService.author.findUnique({
            where: {id}
        })
        return author
    }

    async getAll(type?: AuthorRole){
        if(type){
            if(type !== AuthorRole.CLIENT && type !== AuthorRole.TEAM){
                throw new BadRequestException('Не верный тип автора')
            }
            const authors =  await this.prismaService.author.findMany({where: {type: type}})
            return authors
        }
        const authors = await this.prismaService.author.findMany()
        return authors
    }
}
