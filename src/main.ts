import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path'

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('SERVER_PORT');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        })
    );
    app.enableCors();
    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

    console.log(`Running on port ${ port ?? 3000 }`);

    await app.listen(port ?? 3000);
}
bootstrap();
