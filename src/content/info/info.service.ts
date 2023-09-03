import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateInfoDto } from '@info/dto';


@Injectable()
export class InfoService {
    constructor(private prismaService: PrismaService){}

    async create(dto: CreateInfoDto[]){
        const info = await this.prismaService.infoProject.createMany({
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
