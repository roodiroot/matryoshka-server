import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ProjectService } from '@project/project.service';
import { CreateProjectDto } from '@project/dto';
import { Public, Roles } from '@common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '@auth/guards/role.guard';
import { Role } from '@prisma/client';


@Controller('project')
export class ProjectController {
    constructor(private projectService: ProjectService){}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    @UseInterceptors(FileInterceptor('img'))
    async createProject(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({fileType: '.(png|jpeg|jpg)'}),
                    new MaxFileSizeValidator({ maxSize: 2600000 }),
                ]
              })
        ) img: Express.Multer.File,
        @Body() dto: CreateProjectDto,
        ){
        return await this.projectService.create(dto, img)
    }

    @Public()
    @Get(":idOrName")
    async getOneProject(@Param("idOrName") idOrName: string){
        return await this.projectService.findOne(idOrName)
    }

    @Public()
    @Get()
    async getAllProject(){
        return await this.projectService.getAll()
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(":id")
    async deleteProject(@Param("id") id: string){
        if(isNaN(Number(id))){
            throw new BadRequestException('Не верный формат id')
        }
        return await this.projectService.drop(Number(id))
    }

}
