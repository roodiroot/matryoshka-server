import { AuthorService } from '@author/author.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateRevievDto } from '@review/dto';

@Injectable()
export class ReviewService {
    constructor(private prismaService: PrismaService, private authorService: AuthorService){}

    async create(dto: CreateRevievDto){
        const author = await this.authorService.findOne(dto.authorId)
        if(!author){
            console.log(`Автора с id = ${dto.authorId} не существует`)
            return null
        }
        const info = await this.prismaService.review.create({
            data: dto
        })
        if(!info){
            return null
        }
        return info
    }

    async getProgectId(projectId: number){
        const info = await this.prismaService.infoProject.findMany({
            where: {projectId}
        })
        if(!info){
            return null
        }
        return info
    }
}
