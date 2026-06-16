// ==========================================
// INTERFACES DE MAPEAMENTO DE DADOS
// ==========================================

import { IUsuario } from "./iusuario.component";

export interface MarcoMotor {
  valor: number;
  descricao: string;
  tempoMin: string;
  tempoMax: string;
}

export interface EvolucaoClinica {
  id?: number;
  prontuario?: Prontuario;
  dataConsulta?: Date | null;
  fisioterapeuta?: IUsuario;
  comoChegou?: string;
  procedimento?: string;
  comoSaiu?: string;
}

export interface Prontuario {
  id?: number;
  nome?: string;
  dataNascimento?: Date | null;
  sexo?: string | null;
  idadeCronologica?: string;
  igc?: string; 
  pesoAtual?: number | null;
  comprimento?: number | null;
  pc?: string; 
  pediatra?: string;
  endereco?: string;
  cep?: string;
  numComplemento?: string;

  // Dados Familiares
  mae?: string;
  idatademae?: number | null; // Caso use mapeamentos dinâmicos
  idadeMae?: number | null;
  classNameicacao?: string;   // Caso persista legado
  profissaoMae?: string;
  contatoMae?: string;
  pai?: string;
  idadePai?: number | null;
  profissaoPai?: string;
  contatoPai?: string;
  irmaos?: string;

  // Dados Clínicos de Avaliação Geral
  dataAvaliacao?: Date | null;
  avaliador?: string;
  local?: string;
  classificacao?: string;
  intercorrencias?: string;

  // Histórico de Gestação
  numeroGestacao?: string | null;
  gestacaoMultiplas?: string;
  liquidoAmniotico?: string;
  apresentacaoGestacao?: string;
  intercorrenciasGestacao?: string;

  // Histórico de Parto e Pós-parto
  tipoParto?: string;
  ign?: string;
  duracaoTp?: string;
  intercorrenciasParto?: string;
  pesoNascimento?: number | null;
  apgar?: string;
  comprimentoNascimento?: number | null;
  pcNascimento?: number | null;
  internacaoPosParto?: string;
  intercorrenciaPosParto?: string;

  // Rotinas e Hábitos Diários
  dietaPatologias?: string;
  atividadesDiarias?: string;
  habilidadesMotoras?: string;
  periodoSono?: string;
  posicaoPreferencia?: string;
  acompanhamentoFisioOsteo?: string;
  desenvolvimentoCognitivo?: string;

  // Motivo da Consulta
  queixaPrincipal?: string;

  // Exame Postural
  alinhamentoEstatico?: string;
  controleCervicalTronco?: string;
  tonusMuscular?: string;

  // Resultados Escala Alberta (AIMS)
  scoreProno?: number | null;
  scoreSupino?: number | null;
  scoreSentado?: number | null;
  scoreEmPe?: number | null;
  scoreTotalAlberta?: number | null;
  percentilAlberta?: number | null;
  classificacaoAlberta?: string;
  obsAlberta?: string;

  // Chaves de Indexadores de Itens Selecionados nas Subescalas
  marcosPronoSelecionados?: number[];
  marcosSupinoSelecionados?: number[];
  marcosSentadoSelecionados?: number[];
  marcosEmPeSelecionados?: number[];

  // Sublistas Relacionais (1:N)
  historicoEvolucoes?: EvolucaoClinica[];
  [key: string]: any; // Permite indexação dinâmica segura por string nas funções
}

