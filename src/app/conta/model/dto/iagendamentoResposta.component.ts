


export interface AgendamentoRespostaDto {

  id : number;
  horaInicial: string;
  horaFinal: string;
  nome : String;

  prontuarioId : number;
  profissional: string;

  dtInicial : Date;

  tipoSessao: string;
  icSituacao : string;

}