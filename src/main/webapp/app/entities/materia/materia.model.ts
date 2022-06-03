import { IDocenteMateria } from 'app/entities/docente-materia/docente-materia.model';
import { ISalaMateria } from 'app/entities/sala-materia/sala-materia.model';

export interface IMateria {
  id?: number;
  nombreMateria?: string;
  numeroPreguntas?: number | null;
  pregunta?: string;
  docenteMateria?: IDocenteMateria | null;
  salaMateria?: ISalaMateria | null;
}

export class Materia implements IMateria {
  constructor(
    public id?: number,
    public nombreMateria?: string,
    public numeroPreguntas?: number | null,
    public pregunta?: string,
    public docenteMateria?: IDocenteMateria | null,
    public salaMateria?: ISalaMateria | null
  ) {}
}

export function getMateriaIdentifier(materia: IMateria): number | undefined {
  return materia.id;
}
