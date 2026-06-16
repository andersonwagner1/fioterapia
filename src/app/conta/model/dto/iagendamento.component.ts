import { Prontuario } from "../iprontuario.component";
import { IUsuario } from "../iusuario.component";


export interface AgendamentoDto {

  id : number;
  dtHoraInicial: Date;
  dtHoraFinal: Date;
  paciente : Prontuario;
  usuario : IUsuario;

  tipoSessao: string;
  icSituacao : string;

  dsObservacaoQueixas : string

}