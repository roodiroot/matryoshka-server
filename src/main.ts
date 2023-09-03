import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(cookieParser())
    app.useStaticAssets(path.join(__dirname, "..", "static"))
    app.setGlobalPrefix('api')
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
