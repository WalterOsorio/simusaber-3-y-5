import { ITipoDocumento } from 'app/entities/tipo-documento/tipo-documento.model';
import { IUser } from 'app/entities/user/user.model';
import { IDocente } from 'app/entities/docente/docente.model';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { IAdministrador } from 'app/entities/administrador/administrador.model';

export interface IUserData {
  id?: number;
  numeroDocumento?: string;
  tipoDocumento?: ITipoDocumento | null;
  user?: IUser | null;
  docente?: IDocente | null;
  estudiante?: IEstudiante | null;
  administrador?: IAdministrador | null;
}

export class UserData implements IUserData {
  constructor(
    public id?: number,
    public numeroDocumento?: string,
    public tipoDocumento?: ITipoDocumento | null,
    public user?: IUser | null,
    public docente?: IDocente | null,
    public estudiante?: IEstudiante | null,
    public administrador?: IAdministrador | null
  ) {}
}

export function getUserDataIdentifier(userData: IUserData): number | undefined {
  return userData.id;
}
