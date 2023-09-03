import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorService {
    constructor(private prismaService: PrismaService){}

    async create(dto: CreateAuthorDto){
        const author = await this.prismaService.author.create({
            data: {
                name: dto.name,
                surname: dto.surname,
                jobTitle: dto.jobTitle,
                img: dto.img,
            }
        })

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
