import { Controller } from '@nestjs/common';
import { LibroService } from './libro.service';

@Controller('libro')
export class LibroController {
  constructor(private readonly libroService: LibroService) {}
}
