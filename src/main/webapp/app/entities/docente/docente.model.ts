import { IUserData } from 'app/entities/user-data/user-data.model';
import { ISala } from 'app/entities/sala/sala.model';
import { IDocenteMateria } from 'app/entities/docente-materia/docente-materia.model';

export interface IDocente {
  id?: number;
  colegio?: string;
  materia?: string;
  ciudad?: string;
  userData?: IUserData | null;
  salas?: ISala[] | null;
  docenteMateria?: IDocenteMateria | null;
}

export class Docente implements IDocente {
  constructor(
    public id?: number,
    public colegio?: string,
    public materia?: string,
    public ciudad?: string,
    public userData?: IUserData | null,
    public salas?: ISala[] | null,
    public docenteMateria?: IDocenteMateria | null
  ) {}
}

export function getDocenteIdentifier(docente: IDocente): number | undefined {
  return docente.id;
}
