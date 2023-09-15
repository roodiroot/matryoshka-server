import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(cookieParser())
    app.useStaticAssets(path.join(__dirname, "..", "static"))
    app.enableCors({
        credentials: true,
        origin: ["https://matryoshka-studio.ru", "http://localhost:3000"],
      });
    app.setGlobalPrefix('api')
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(PORT, () => console.log(`Srver started on PORT ${PORT}`));
}
bootstrap();
