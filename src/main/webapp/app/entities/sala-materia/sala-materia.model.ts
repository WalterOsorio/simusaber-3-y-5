import { ISala } from 'app/entities/sala/sala.model';
import { IMateria } from 'app/entities/materia/materia.model';

export interface ISalaMateria {
  id?: number;
  idSala?: number | null;
  idMateria?: number | null;
  salas?: ISala[] | null;
  materias?: IMateria[] | null;
}

export class SalaMateria implements ISalaMateria {
  constructor(
    public id?: number,
    public idSala?: number | null,
    public idMateria?: number | null,
    public salas?: ISala[] | null,
    public materias?: IMateria[] | null
  ) {}
}

export function getSalaMateriaIdentifier(salaMateria: ISalaMateria): number | undefined {
  return salaMateria.id;
}
