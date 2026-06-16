import { Prontuario } from "./iprontuario.component";
import { IUsuario } from "./iusuario.component";

export interface Agendamento {
  id?: number;

    paciente? : Prontuario;

  dataHoraInicio?: String;
  dataHoraFim?: String;
  profissional?: string;
  tipoSessao?: string;
  status?: string;
  observacoes?: string;
}


export interface AgendamentoEditar {
  id?: number;

    paciente? : Prontuario;

  dataHoraInicio?: Date;
  dataHoraFim?: Date;
  usuario? : IUsuario;
  tipoSessao?: string;
  status?: string;
  observacoes?: string;
}