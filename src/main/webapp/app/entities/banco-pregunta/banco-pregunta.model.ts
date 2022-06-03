import dayjs from 'dayjs/esm';
import { IPrueba } from 'app/entities/prueba/prueba.model';
import { IPruebaApoyo } from 'app/entities/prueba-apoyo/prueba-apoyo.model';
import { IAdmiBancoP } from 'app/entities/admi-banco-p/admi-banco-p.model';

export interface IBancoPregunta {
  id?: number;
  descripcion?: string;
  fechaActualizacion?: dayjs.Dayjs | null;
  materia?: string;
  numeroPreguntas?: number | null;
  pregunta?: string;
  pruebas?: IPrueba[] | null;
  pruebaApoyos?: IPruebaApoyo[] | null;
  admiBancoP?: IAdmiBancoP | null;
}

export class BancoPregunta implements IBancoPregunta {
  constructor(
    public id?: number,
    public descripcion?: string,
    public fechaActualizacion?: dayjs.Dayjs | null,
    public materia?: string,
    public numeroPreguntas?: number | null,
    public pregunta?: string,
    public pruebas?: IPrueba[] | null,
    public pruebaApoyos?: IPruebaApoyo[] | null,
    public admiBancoP?: IAdmiBancoP | null
  ) {}
}

export function getBancoPreguntaIdentifier(bancoPregunta: IBancoPregunta): number | undefined {
  return bancoPregunta.id;
}
