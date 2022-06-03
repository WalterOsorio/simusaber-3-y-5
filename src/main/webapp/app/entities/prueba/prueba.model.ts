import dayjs from 'dayjs/esm';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { IBancoPregunta } from 'app/entities/banco-pregunta/banco-pregunta.model';
import { ISala } from 'app/entities/sala/sala.model';

export interface IPrueba {
  id?: number;
  fechaAplicacion?: dayjs.Dayjs | null;
  resultado?: number | null;
  retroalimentacion?: string;
  estudiante?: IEstudiante | null;
  bancoPregunta?: IBancoPregunta | null;
  sala?: ISala | null;
}

export class Prueba implements IPrueba {
  constructor(
    public id?: number,
    public fechaAplicacion?: dayjs.Dayjs | null,
    public resultado?: number | null,
    public retroalimentacion?: string,
    public estudiante?: IEstudiante | null,
    public bancoPregunta?: IBancoPregunta | null,
    public sala?: ISala | null
  ) {}
}

export function getPruebaIdentifier(prueba: IPrueba): number | undefined {
  return prueba.id;
}
