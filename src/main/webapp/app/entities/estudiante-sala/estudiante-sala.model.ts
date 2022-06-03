import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { ISala } from 'app/entities/sala/sala.model';

export interface IEstudianteSala {
  id?: number;
  idEstudiante?: number | null;
  idSala?: number | null;
  estudiantes?: IEstudiante[] | null;
  salas?: ISala[] | null;
}

export class EstudianteSala implements IEstudianteSala {
  constructor(
    public id?: number,
    public idEstudiante?: number | null,
    public idSala?: number | null,
    public estudiantes?: IEstudiante[] | null,
    public salas?: ISala[] | null
  ) {}
}

export function getEstudianteSalaIdentifier(estudianteSala: IEstudianteSala): number | undefined {
  return estudianteSala.id;
}
