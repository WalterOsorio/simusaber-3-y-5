import { IAdministrador } from 'app/entities/administrador/administrador.model';
import { IBancoPregunta } from 'app/entities/banco-pregunta/banco-pregunta.model';

export interface IAdmiBancoP {
  id?: number;
  idAdministrador?: number | null;
  idBancoPregunta?: number | null;
  administradors?: IAdministrador[] | null;
  bancoPreguntas?: IBancoPregunta[] | null;
}

export class AdmiBancoP implements IAdmiBancoP {
  constructor(
    public id?: number,
    public idAdministrador?: number | null,
    public idBancoPregunta?: number | null,
    public administradors?: IAdministrador[] | null,
    public bancoPreguntas?: IBancoPregunta[] | null
  ) {}
}

export function getAdmiBancoPIdentifier(admiBancoP: IAdmiBancoP): number | undefined {
  return admiBancoP.id;
}
