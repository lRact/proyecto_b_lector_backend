import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard)
    @Get()
    getAll() {
        return this.authService.getAll();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.authService.getById(id);
    }

    @Post('register')
    register(@Body() createUsuarioDto: CreateUsuarioDto) {
        return this.authService.register(createUsuarioDto);
    }

    @Post('login')
    login(@Body() loginUsuarioDto: LoginUsuarioDto) {
        return this.authService.login(loginUsuarioDto);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
        return this.authService.update(id, updateUsuarioDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.authService.delete(id);
    }
}
