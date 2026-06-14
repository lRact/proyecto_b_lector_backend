import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { MessageDto } from '../common/message.dto';
import * as bcrypt from 'bcrypt';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private usuarioRepository: Repository<UsuarioEntity>,
    private jwtService: JwtService,
  ) {}

  async getAll(): Promise<UsuarioEntity[]> {
    const list = await this.usuarioRepository.find();

    if (!list.length) {
      throw new NotFoundException('No se encontraron usuarios.');
    }

    return list;
  }

  async getById(id: number): Promise<UsuarioEntity> {
    const user = await this.usuarioRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return user;
  }

  async getByEmail(email: string): Promise<UsuarioEntity> {
    const user = await this.usuarioRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return user;
  }

  async register(createUsuarioDto: CreateUsuarioDto): Promise<MessageDto> {
    const numRound = 10;
    const emailExists = await this.usuarioRepository.findOneBy({
      email: createUsuarioDto.email,
    });

    if (emailExists) {
      throw new ConflictException('El correo ya esta en uso.');
    }

    createUsuarioDto.password = await bcrypt.hash(
      createUsuarioDto.password,
      numRound,
    );

    const nuevoUsuario = this.usuarioRepository.create({
      nombre: createUsuarioDto.nombre,
      email: createUsuarioDto.email,
      password: createUsuarioDto.password,
    });

    await this.usuarioRepository.save(nuevoUsuario);

    return new MessageDto('El usuario fue creado correctamente.');
  }

  async login(loginUsuarioDto: LoginUsuarioDto): Promise<{ accessToken: string }> {
      const { email, password } = loginUsuarioDto;
      const emailExists = await this.usuarioRepository.findOneBy({ email });

      if(!emailExists) {
          throw new UnauthorizedException('Credenciales invalidas.');
      }

      const passwordMatch = await bcrypt.compare(password, emailExists.password);

      if(!passwordMatch) {
          throw new UnauthorizedException('Credenciales invalidas.');
      }

      const token = await this.generateToken(emailExists.id);

      return { accessToken: token.accessToken };
  }

  async generateToken(userId) {
    const accessToken = this.jwtService.sign({ userId });
    return { accessToken };
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<MessageDto> {
      const numRound = 10;
      const usuario = await this.getById(id);

      if(!usuario) {
          throw new NotFoundException('Usuario no encontrado.');
      }

      if(updateUsuarioDto.email) {
          const exists = await this.getByEmail(updateUsuarioDto.email);

          if(exists && exists.id !== id) {
              throw new ConflictException('El correo ya esta en uso');
          }
      }

      if(updateUsuarioDto.password) {
          updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, numRound);
      }

      await this.usuarioRepository.update(id, updateUsuarioDto);

      return new MessageDto('El usuario fue actualizado correctamente.');
  }

  async delete(id: number): Promise<MessageDto> {
      const usuario = await this.getById(id);

      if(!usuario) {
          throw new NotFoundException('Usuario no encontrado.');
      }

      await this.usuarioRepository.remove(usuario);

      return new MessageDto('El usuario fue eliminado correctamente.');
  }
}
