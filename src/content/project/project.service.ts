import { BadRequestException, Injectable } from '@nestjs/common';
import { AchievedService } from '@achieved/achieved.service';
import { CreateAchievedDto } from '@achieved/dto';
import { CreateInfoDto } from '@info/dto';
import { InfoService } from '@info/info.service';
import { PrismaService } from '@prisma/prisma.service';
import { CreateProjectDto } from '@project/dto';
import { ReviewService } from '@review/review.service';
import { FilesService } from '@files/files.service';

const checkArray = (array: CreateInfoDto[] | CreateAchievedDto[]) => {
    for(let i = 0; i < array.length; i++){
        if(!array[i].title || !array[i].description){
            return false
        }
        if(typeof array[i].title !== 'string' || typeof array[i].description !== 'string'){
            return false
        }
    }
    return true
}

@Injectable()
export class ProjectService {
    constructor(
        private prismaService: PrismaService,
        private infoService: InfoService,
        private reviewService: ReviewService,
        private achievedService: AchievedService,
        private filesService: FilesService
    ){}

    // СОЗДАНИЕ ПРОЕКТА
    async create(dto: CreateProjectDto, img: Express.Multer.File){
        // ПРОВЕРЯЕМ МАССИВ СТЕКА ЧТО БЫ ТАМ БЫЛИ ТОЛЬКО СТРОКИ
        const stackArray = dto.stack
        for(let i = 0; i < stackArray.length; i++){
            if(typeof stackArray[i] !== 'string' || stackArray[i].length > 30 ){
                throw new BadRequestException('Не верные значения массива stack')
            }
        }
        // СОЗДАЁМ ПРОЕКТ
        const examinationProj = await this.findOne(dto.name)
        if(examinationProj){
            throw new BadRequestException(`Проект ${dto.name} уже существует`)
        }
        const fileName = await this.filesService.createFile(img)
        if(!fileName){
            throw new BadRequestException("Ошибка при загрузке фаила")
        }
        const project = await this.prismaService.project.create({
            data: {
                name: dto.name,
                teme: dto.teme,
                title: dto.title,
                description: dto. description,
                img: fileName,
                article: dto.article,
                stack: dto.stack
            }
        })
        if(!project){
            return null
        }
        // СОЗДАЕМ ТЕКСТ "REVIEW"
        if(isNaN(Number(dto.authorId))){
            await this.drop(project.id)
            throw new BadRequestException('Не верный формат authorId')
        }
        const review = await this.reviewService.create({
            text: dto.text,
            authorId: Number(dto.authorId),
            projectId: project.id
        })
        if(!review){
            await this.drop(project.id)
            throw new BadRequestException('Не получилось создать отзыв')
        }
        // СОЗДАЕМ "INFO"
        if(!checkArray(dto.info)){
            await this.drop(project.id)
            throw new BadRequestException('Не получилось создать массив информации для проекта')
        }
        const info = await this.infoService.create(
            dto.info.map(i => ({title: i.title, description: i.description, projectId: project.id}))
            )
        if(!info){
            await this.drop(project.id)
            throw new BadRequestException('Не получилось создать массив информации для проекта')
        }
        // СОЗДАЕМ "ACHIEVED"
        if(!checkArray(dto.achieved)){
            await this.drop(project.id)
            throw new BadRequestException('Не получилось создать массив преимуществ для проекта')
        }
        const achieved = await this.achievedService.create(
            dto.achieved.map(a => ({title: a.title, description: a.description, projectId: project.id}))
        )
        if(!achieved){
            await this.drop(project.id)
            throw new BadRequestException('Не получилось создать массив преимуществ для проекта')
        }

        return project
    }

    // ПОКАЗАТЬ ВСЕ ПРОЕКТЫ
    async getAll(){
        return await this.prismaService.project.findMany({
            include: {
                infoProject: true,
                review: {
                    include: {
                        author: true
                    }
                },
                achieved: true
            }
        })
    }

    // ПОКАЗАТЬ ОДИН ПРОЕКТ ПО ID ИЛИ NAME
    async findOne(nameOrIs: string){
        const project = await this.prismaService.project.findFirst({
            where: {
                OR: [{id: isNaN(Number(nameOrIs)) ? 0 : Number(nameOrIs)}, {name: nameOrIs}]
            },
            include: {
                infoProject: true,
                review: {
                    include: {
                        author: true
                    }
                },
                achieved: true
            }
        })
        if(!project){
            return null
        }
        return project
    }

    // УДАЛИТЬ ПРОЕКТ ПО ID
    async drop(id: number){
        const project = await this.findOne(String(id))
        if(!project){
            return null
        }
        const dropProject = await this.prismaService.project.delete({
            where: {id}
        })
        return dropProject
    }
}
