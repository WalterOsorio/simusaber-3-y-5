import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { IBancoPregunta } from 'app/entities/banco-pregunta/banco-pregunta.model';

export interface IPruebaApoyo {
  id?: number;
  materia?: string;
  pregunta?: string;
  resultado?: number | null;
  retroalimentacion?: string;
  estudiante?: IEstudiante | null;
  bancoPregunta?: IBancoPregunta | null;
}

export class PruebaApoyo implements IPruebaApoyo {
  constructor(
    public id?: number,
    public materia?: string,
    public pregunta?: string,
    public resultado?: number | null,
    public retroalimentacion?: string,
    public estudiante?: IEstudiante | null,
    public bancoPregunta?: IBancoPregunta | null
  ) {}
}

export function getPruebaApoyoIdentifier(pruebaApoyo: IPruebaApoyo): number | undefined {
  return pruebaApoyo.id;
}
