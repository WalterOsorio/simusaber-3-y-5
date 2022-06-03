import { IUserData } from 'app/entities/user-data/user-data.model';
import { State } from 'app/entities/enumerations/state.model';

export interface ITipoDocumento {
  id?: number;
  iniciales?: string;
  nombreDocumento?: string;
  estadoTipoDocumento?: State;
  userData?: IUserData | null;
}

export class TipoDocumento implements ITipoDocumento {
  constructor(
    public id?: number,
    public iniciales?: string,
    public nombreDocumento?: string,
    public estadoTipoDocumento?: State,
    public userData?: IUserData | null
  ) {}
}

export function getTipoDocumentoIdentifier(tipoDocumento: ITipoDocumento): number | undefined {
  return tipoDocumento.id;
}
