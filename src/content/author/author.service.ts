import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FilesService } from '@files/files.service';

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
        const author = await this.prismaService.author.create({
            data: {
                name: dto.name,
                surname: dto.surname,
                jobTitle: dto.jobTitle,
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

    async getAll(){
        const authors = await this.prismaService.author.findMany()
        return authors
    }
}
