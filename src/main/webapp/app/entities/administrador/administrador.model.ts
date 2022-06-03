import { IUserData } from 'app/entities/user-data/user-data.model';
import { IAdmiBancoP } from 'app/entities/admi-banco-p/admi-banco-p.model';

export interface IAdministrador {
  id?: number;
  nivelAcceso?: number | null;
  userData?: IUserData | null;
  admiBancoP?: IAdmiBancoP | null;
}

export class Administrador implements IAdministrador {
  constructor(
    public id?: number,
    public nivelAcceso?: number | null,
    public userData?: IUserData | null,
    public admiBancoP?: IAdmiBancoP | null
  ) {}
}

export function getAdministradorIdentifier(administrador: IAdministrador): number | undefined {
  return administrador.id;
}
