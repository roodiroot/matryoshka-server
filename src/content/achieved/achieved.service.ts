import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateAchievedDto } from '@achieved/dto';

@Injectable()
export class AchievedService {
    constructor(private prismaService: PrismaService){}

    async create(dto: CreateAchievedDto[]){
        const info = await this.prismaService.achieved.createMany({
            data: dto
        })
        if(!info){
            return null
        }
        return info
    }

    async getProgectId(projectId: number){
        const info = await this.prismaService.achieved.findMany({
            where: {projectId}
        })
        if(!info){
            return null
        }
        return info
    }
}
