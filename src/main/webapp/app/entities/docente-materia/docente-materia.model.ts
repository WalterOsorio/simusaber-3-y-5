import { IDocente } from 'app/entities/docente/docente.model';
import { IMateria } from 'app/entities/materia/materia.model';

export interface IDocenteMateria {
  id?: number;
  idDocente?: number | null;
  idMateria?: number | null;
  docentes?: IDocente[] | null;
  materias?: IMateria[] | null;
}

export class DocenteMateria implements IDocenteMateria {
  constructor(
    public id?: number,
    public idDocente?: number | null,
    public idMateria?: number | null,
    public docentes?: IDocente[] | null,
    public materias?: IMateria[] | null
  ) {}
}

export function getDocenteMateriaIdentifier(docenteMateria: IDocenteMateria): number | undefined {
  return docenteMateria.id;
}
