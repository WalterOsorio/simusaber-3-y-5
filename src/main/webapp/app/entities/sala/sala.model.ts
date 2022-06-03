import { IPrueba } from 'app/entities/prueba/prueba.model';
import { ISalaMateria } from 'app/entities/sala-materia/sala-materia.model';
import { IDocente } from 'app/entities/docente/docente.model';
import { IEstudianteSala } from 'app/entities/estudiante-sala/estudiante-sala.model';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { State } from 'app/entities/enumerations/state.model';

export interface ISala {
  id?: number;
  estado?: State | null;
  materia?: string;
  numeroEstudiantes?: number | null;
  resultados?: number | null;
  retroalimentacion?: string;
  pruebas?: IPrueba[] | null;
  salaMateria?: ISalaMateria | null;
  docente?: IDocente | null;
  estudianteSala?: IEstudianteSala | null;
  estudiantes?: IEstudiante[] | null;
}

export class Sala implements ISala {
  constructor(
    public id?: number,
    public estado?: State | null,
    public materia?: string,
    public numeroEstudiantes?: number | null,
    public resultados?: number | null,
    public retroalimentacion?: string,
    public pruebas?: IPrueba[] | null,
    public salaMateria?: ISalaMateria | null,
    public docente?: IDocente | null,
    public estudianteSala?: IEstudianteSala | null,
    public estudiantes?: IEstudiante[] | null
  ) {}
}

export function getSalaIdentifier(sala: ISala): number | undefined {
  return sala.id;
}
