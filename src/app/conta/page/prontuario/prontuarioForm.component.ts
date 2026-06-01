
import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';

@Component({
  selector: 'app-prontuario-form',
  templateUrl: './prontuarioForm.component.html',
  styleUrl: './prontuarioForm.component.scss',
 providers: [MessageService, MensagemAvisoService]
 
})

// 1. Nova interface para isolar cada atendimento/sessão do paciente


export class ProntuarioFormComponent implements OnInit {

  exibindoFormEvolucao : boolean;

  // Subtotais das Escalas
scoreProno?: number | null;
scoreSupino?: number | null;
scoreSentado?: number | null;
scoreEmPe?: number | null;
scoreTotalAlberta?: number | null;

// Arrays de Controle de Seleção Visual (IDs dos itens marcados)
marcosPronoSelecionados?: number[];
marcosSupinoSelecionados?: number[];
marcosSentadoSelecionados?: number[];
marcosEmPeSelecionados?: number[];

// Metadados de Resultados
percentilAlberta?: number | null; // Alterado para number para casar com p-inputNumber
classificacaoAlberta?: string;
obsAlberta?: string;
  
// Inicializa a sublista se ela vier nula do banco
verificarSublistaHistorico(): void {
  if (!this.registro.historicoEvolucoes) {
    this.registro.historicoEvolucoes = [];
  }
}

novaEvolucao: EvolucaoClinica = {};

onNovaEvolucao(): void {
  this.exibindoFormEvolucao = true;
  this.novaEvolucao = {
    dataConsulta: new Date(),
    fisioterapeuta: this.profissionalLogado,
    comoChegou: '',
    procedimento: '',
    comoSaiu: ''
  };
}


onConfirmarInclusaoEvolucao(): void {
  if (!this.novaEvolucao.comoChegou || !this.novaEvolucao.procedimento) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atenção',
      detail: 'Preencha os dados mínimos da evolução antes de salvar.'
    });
    return;
  }

  this.verificarSublistaHistorico();
  
  // Adiciona a nova sessão no topo do histórico do prontuário do paciente
  this.registro.historicoEvolucoes?.unshift({ ...this.novaEvolucao });
  
  // Fecha o mini-formulário e limpa o objeto temporário
  this.exibindoFormEvolucao = false;
  this.novaEvolucao = {};

  this.messageService.add({
    severity: 'info',
    summary: 'Inclusão Local',
    detail: 'Sessão adicionada à lista temporal. Lembre-se de Salvar o prontuário para gravar definitivo.'
  });
}




  profissionalLogado = 'Dra Eliane Alves de Oliveira Juvenal'; // Substitua pelo nome do profissional logado

  telaConfirmacaoRegistroSelecionado : boolean;
  telaConfirmacaoExclusao: boolean;

  // Armazenamento temporário dos dados retornados para formatação
  dadosEnderecoLogradouro = '';
  dadosEnderecoBairro = '';
  dadosEnderecoCidade = '';
  dadosEnderecoUf = '';

  telaRegistro : boolean;
  telaExclusao : boolean;

  

  sexoOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' },
    { label: 'Não Informado', value: 'N' }
  ];

  classificacaoOptions = [
    { label: '(Sem informação)', value: 'NONE' },
  { label: 'Desenvolvimento Adequado', value: 'ADEQUADO' },
  { label: 'Alerta para o Desenvolvimento', value: 'ALERTA' },
  { label: 'Provável Atraso no Desenvolvimento', value: 'ATRASO' }
];

  registro : Prontuario; // Substitua 'any' pelo tipo correto do seu registro
  
  // Controle de visibilidade em duas vias (Two-way Data Binding)
  @Input() visivel = false;
  @Output() visivelChange = new EventEmitter<boolean>();
carregandoCep = false;
  // Dados recebidos do componente Pai


  // Eventos emitidos para o componente Pai tratar a persistência
  @Output() salvar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  loading : boolean;

   constructor(
    private http: HttpClient, // <-- Injete o HttpClient aqui
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
   
    this.registro = {};

    if (!this.registro.marcosPronoSelecionados) {
      this.registro.marcosPronoSelecionados = [];
    }
  


  }


  onCalcularIdadeCronologica(): void {
  if (!this.registro.dataNascimento) {
    this.registro.idadeCronologica = '';
    return;
  }

  // Garante que o valor seja um objeto Date válido
  const dataNasc = new Date(this.registro.dataNascimento);
  const hoje = new Date();

  // Se a data de nascimento inserida for maior que a data atual
  if (dataNasc > hoje) {
    this.registro.idadeCronologica = 'Data de nascimento futura';
    return;
  }

  let anos = hoje.getFullYear() - dataNasc.getFullYear();
  let meses = hoje.getMonth() - dataNasc.getMonth();
  let dias = hoje.getDate() - dataNasc.getDate();

  // Ajuste caso o dia atual seja menor que o dia de nascimento
  if (dias < 0) {
    meses--;
    // Pega o último dia do mês anterior ao mês atual
    const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate();
    dias += ultimoDiaMesAnterior;
  }

  // Ajuste caso o mês atual seja menor que o mês de nascimento
  if (meses < 0) {
    anos--;
    meses += 12;
  }

  // Formatação gramatical das strings (Singular / Plural)
  const strAnos = anos === 1 ? '1 ano' : `${anos} anos`;
  const strMeses = meses === 1 ? '1 mês' : `${meses} meses`;
  const strDias = dias === 1 ? '1 dia' : `${dias} dias`;

  // Monta o resultado final exatamente no padrão: "0 anos, 1 mês e 5 dias"
  this.registro.idadeCronologica = `${strAnos}, ${strMeses} e ${strDias}`;
}

  buscarCep(): void {
    const cepLimpo = this.registro.cep?.replace(/\D/g, ''); // Remove traços ou espaços

    if (!cepLimpo || cepLimpo.length !== 8) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Informe um CEP válido com 8 dígitos.'
      });
      return;
    }

    this.carregandoCep = true;

    this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe({
      next: (dados) => {
        if (dados.erro) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'CEP não encontrado.'
          });
          this.limparCamposEndereco();
        } else {
          // Guarda as variáveis para concatenar com o número depois
          this.dadosEnderecoLogradouro = dados.logradouro;
          this.dadosEnderecoBairro = dados.bairro;
          this.dadosEnderecoCidade = dados.localidade;
          this.dadosEnderecoUf = dados.uf;

          // Executa a primeira montagem do endereço
          this.atualizarEnderecoCompleto();
          
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Endereço localizado!'
          });
        }
        this.carregandoCep = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao conectar com o serviço de busca de CEP.'
        });
        this.carregandoCep = false;
      }
    });
  }

  atualizarEnderecoCompleto(): void {
    const numeroStr = this.registro.numComplemento ? `, ${this.registro.numComplemento}` : ', [NUMERO / Complemento]';
    
    if (this.dadosEnderecoLogradouro) {
      // Monta exatamente no formato: Rua Nova Yorque, 150, Taboão, Diadema - SP
      this.registro.endereco = `${this.dadosEnderecoLogradouro}${numeroStr}, ${this.dadosEnderecoBairro}, ${this.dadosEnderecoCidade} - ${this.dadosEnderecoUf}`;
    }
  }

  limparCamposEndereco(): void {
    this.dadosEnderecoLogradouro = '';
    this.dadosEnderecoBairro = '';
    this.dadosEnderecoCidade = '';
    this.dadosEnderecoUf = '';
    this.registro.endereco = '';
    this.registro.numComplemento = '';
  }



 

  onSalvar(): void {
    this.salvar.emit();
  }

  // Lista mockada com os exatos dados da sua imagem (sequência da esquerda para a direita)
  listaMarcosProno: MarcoMotor[] = [
    { valor: 1, imagem: 'prono_01.png', descricao: 'Flexão fisiológica', tempoMin: '-', tempoMax: '-' },
    { valor: 2, imagem: 'prono_02.png', descricao: 'Extensão cervical inicial', tempoMin: '15d', tempoMax: '2m' },
    { valor: 3, imagem: 'prono_03.png', descricao: 'Sustentação de antebraço baixa', tempoMin: '1m10d', tempoMax: '2m25d' },
    { valor: 4, imagem: 'prono_04.png', descricao: 'Elevação de tronco e cabeça', tempoMin: '2m15d', tempoMax: '3m20d' },
    { valor: 5, imagem: 'prono_05.png', descricao: 'Extensão com apoio de mãos', tempoMin: '3m', tempoMax: '4m' },
    { valor: 6, imagem: 'prono_06.png', descricao: 'Cervical a 90 graus', tempoMin: '2m20d', tempoMax: '5m' },
    { valor: 7, imagem: 'prono_07.png', descricao: 'Pivoteamento / Natação', tempoMin: '4m10d', tempoMax: '6m' },
    { valor: 8, imagem: 'prono_08.png', descricao: 'Rolamento prono para supino', tempoMin: '6m', tempoMax: '8m15d' },
    { valor: 9, imagem: 'prono_09.png', descricao: 'Arrasto inicial', tempoMin: '5m', tempoMax: '8m' },
    { valor: 10, imagem: 'prono_10.png', descricao: 'Início de quatro apoios', tempoMin: '5m', tempoMax: '7m' },
    { valor: 11, imagem: 'prono_11.png', descricao: 'Engatinhar definitivo', tempoMin: '5m20d', tempoMax: '8m55d' }
  ];






listaMarcosSupino: any[] = [
  { valor: 1, descricao: 'Flexão fisiológica em supino', tempoMin: 'Nascer', tempoMax: '1m' },
  { valor: 2, descricao: 'Postura tônica cervical (RTCA)', tempoMin: '15d', tempoMax: '2m' },
  { valor: 3, descricao: 'Movimentos recíprocos de pernas', tempoMin: '1m', tempoMax: '3m' },
  { valor: 4, descricao: 'Controle de linha média de cabeça', tempoMin: '2m', tempoMax: '4m' },
  { valor: 5, descricao: 'Mãos ao corpo e linha média', tempoMin: '3m', tempoMax: '5m' },
  { valor: 6, descricao: 'Extensão ativa de pernas / Chutes', tempoMin: '4m', tempoMax: '6m' },
  { valor: 7, descricao: 'Mãos aos joelhos / Elevação pélvica', tempoMin: '4m15d', tempoMax: '7m' },
  { valor: 8, descricao: 'Mãos aos pés / Exploração sensorial', tempoMin: '5m', tempoMax: '8m' },
  { valor: 9, descricao: 'Rolamento supino para prono', tempoMin: '5m15d', tempoMax: '9m' }
];

listaMarcosSentado: any[] = [
  { valor: 1, descricao: 'Sentado com apoio total (Cifose total)', tempoMin: 'Nascer', tempoMax: '2m' },
  { valor: 2, descricao: 'Sustentação cervical fugaz', tempoMin: '1m', tempoMax: '3m' },
  { valor: 3, descricao: 'Controle de cabeça ao puxar p/ sentado', tempoMin: '2m10d', tempoMax: '4m' },
  { valor: 4, descricao: 'Sentado com apoio anterior de braços', tempoMin: '4m', tempoMax: '6m' },
  { valor: 5, descricao: 'Alinhamento de tronco superior', tempoMin: '4m20d', tempoMax: '6m15d' },
  { valor: 6, descricao: 'Sentado sem apoio por breves segundos', tempoMin: '5m', tempoMax: '7m' },
  { valor: 7, descricao: 'Sentado independente estável', tempoMin: '5m15d', tempoMax: '8m' },
  { valor: 8, descricao: 'Sentado com rotação de tronco livre', tempoMin: '6m', tempoMax: '9m' },
  { valor: 9, descricao: 'Passagem de sentado para prono', tempoMin: '6m15d', tempoMax: '10m' },
  { valor: 10, descricao: 'Sentado em banco (ajuste de pés)', tempoMin: '7m', tempoMax: '11m' },
  { valor: 11, descricao: 'Pivot sobre o bumbum', tempoMin: '8m', tempoMax: '12m' },
  { valor: 12, descricao: 'Controle reacional completo', tempoMin: '9m', tempoMax: '12m' }
];

listaMarcosEmPe: any[] = [
  { valor: 1, descricao: 'Astasia fisiológica inicial', tempoMin: 'Nascer', tempoMax: '2m' },
  { valor: 2, descricao: 'Suporte de peso fugaz com apoio', tempoMin: '2m', tempoMax: '4m' },
  { valor: 3, descricao: 'Alinhamento de quadris sob tronco', tempoMin: '3m15d', tempoMax: '5m' },
  { valor: 4, descricao: 'Ortostase ativa com apoio axilar', tempoMin: '4m', tempoMax: '6m' },
  { valor: 5, descricao: 'Pula/Descarrega peso ativamente', tempoMin: '5m', tempoMax: '8m' },
  { valor: 6, descricao: 'Fica em pé apoiado em móveis', tempoMin: '6m', tempoMax: '9m' },
  { valor: 7, descricao: 'Puxa-se para ficar em pé', tempoMin: '7m', tempoMax: '10m' },
  { valor: 8, descricao: 'Cruzeiro (marcha lateral apoiada)', tempoMin: '7m20d', tempoMax: '11m' },
  { valor: 9, descricao: 'Fica em pé apoiando apenas uma das mãos', tempoMin: '8m', tempoMax: '11m15d' },
  { valor: 10, descricao: 'Fica em pé sem apoio por instantes', tempoMin: '9m', tempoMax: '12m' },
  { valor: 11, descricao: 'Ortostase independente estável', tempoMin: '10m', tempoMax: '14m' },
  { valor: 12, descricao: 'Agacha e levanta sem apoio', tempoMin: '10m15d', tempoMax: '15m' },
  { valor: 13, descricao: 'Marcha inicial (passos independentes)', tempoMin: '11m', tempoMax: '15m' },
  { valor: 14, descricao: 'Marcha fluida / Corrida inicial', tempoMin: '12m', tempoMax: '16m' },
  { valor: 15, descricao: 'Subir degraus com apoio', tempoMin: '13m', tempoMax: '16m' },
  { valor: 16, descricao: 'Chutar bola sem perder o equilíbrio', tempoMin: '14m', tempoMax: '16m' }
];

isMarcoSelecionado(subescala: string, valor: number): boolean {
  const chave = `marcos${subescala.charAt(0).toUpperCase() + subescala.slice(1)}Selecionados`;
  return this.registro[chave]?.includes(valor) || false;
}

onAlternarMarco(subescala: string, item: any): void {
  const fieldChave = `marcos${subescala.charAt(0).toUpperCase() + subescala.slice(1)}Selecionados`;
  
  if (!this.registro[fieldChave]) {
    this.registro[fieldChave] = [];
  }

  const index = this.registro[fieldChave].indexOf(item.valor);
  if (index > -1) {
    this.registro[fieldChave].splice(index, 1);
  } else {
    this.registro[fieldChave].push(item.valor);
  }

  this.registro[fieldChave].sort((a: number, b: number) => a - b);
  this.atualizarSubtotaisERecalcular(subescala, fieldChave);
}

atualizarSubtotaisERecalcular(subescala: string, fieldChave: string): void {
  const scoreChave = `score${subescala.charAt(0).toUpperCase() + subescala.slice(1)}`;
  const selecionados = this.registro[fieldChave] || [];

  if (selecionados.length === 0) {
    this.registro[scoreChave] = 0;
  } else {
    // Regra oficial AIMS: Pontuação do maior marco motor atingido
    this.registro[scoreChave] = Math.max(...selecionados);
  }

  this.calcularTotalAlberta();
}

calcularTotalAlberta(): void {
  const prono = this.registro.scoreProno || 0;
  const supino = this.registro.scoreSupino || 0;
  const sentado = this.registro.scoreSentado || 0;
  const emPe = this.registro.scoreEmPe || 0;

  this.registro.scoreTotalAlberta = prono + supino + sentado + emPe;
}




onCalcularClassificacaoAlberta(): void {


 const pct = this.registro.percentilAlberta !== null && this.registro.percentilAlberta !== undefined
    ? +this.registro.percentilAlberta 
    : null;

  if (pct === null || isNaN(pct)) {
    this.registro.classificacaoAlberta = '';
    return;
  }

  // Linhas de corte clínicas da Escala Alberta de Alberta (AIMS)
  if (pct < 5) {
    this.registro.classificacaoAlberta = 'Atraso no Desenvolvimento Motor';
  } else if (pct >= 5 && pct <= 25) {
    this.registro.classificacaoAlberta = 'Alerta para o Desenvolvimento Motor';
  } else {
    this.registro.classificacaoAlberta = 'Desenvolvimento Motor Normal / Adequado';
  }
}

  onAlternarMarcoProno(item: MarcoMotor): void {
    if (!this.registro.marcosPronoSelecionados) {
      this.registro.marcosPronoSelecionados = [];
    }

    const index = this.registro.marcosPronoSelecionados.indexOf(item.valor);
    
    if (index > -1) {
      // Se já estava selecionado, remove do array
      this.registro.marcosPronoSelecionados.splice(index, 1);
    } else {
      // Se não estava, adiciona
      this.registro.marcosPronoSelecionados.push(item.valor);
    }

    // Ordena o array para manter consistência
    this.registro.marcosPronoSelecionados.sort((a, b) => a - b);

    // Atualiza o score bruto de Prono com base nas regras da AIMS
    // (Geralmente conta-se o total de itens observados antes da janela + os da janela)
    this.atualizarPontuacaoAlberta();
  }

  atualizarPontuacaoAlberta(): void {
    if (!this.registro.marcosPronoSelecionados || this.registro.marcosPronoSelecionados.length === 0) {
      this.registro.scoreProno = 0;
    } else {
      // Regra básica/exemplo: pega o valor do marco motor mais alto selecionado
      this.registro.scoreProno = Math.max(...this.registro.marcosPronoSelecionados);
    }
    
    // Dispara a função principal que soma Prono + Supino + Sentado + Em Pé que criamos antes
    this.calcularTotalAlberta();
  }






  esconderCaixaDialogo(): void {
    this.visivel = false;
    this.visivelChange.emit(false);
  }

  onVoltar(){

  }

  onFechar(): void {
    this.visivel = false;
    this.visivelChange.emit(false);
    this.cancelar.emit();
  }

  onSalvarRegistro(){

  }
}

export interface Prontuario {
  // Controle e Identificação
  id?: number;
  nome?: string;
  
  // Dados Pessoais
  dataNascimento?: Date | null;
  sexo?: string | null;
  idadeCronologica?: string;
  igc?: string; // Idade Gestacional Corrigida
  pesoAtual?: number | null;
  comprimento?: number | null;
  pc?: string; // Perímetro Cefálico
  pediatra?: string;
  endereco?: string;

  // Dados Familiares (Novos Campos)
  mae?: string;
  idadeMae?: number | null;
  profissaoMae?: string;
  contatoMae?: string;
  
  pai?: string;
  idadePai?: number | null;
  profissaoPai?: string;
  contatoPai?: string;
  
  irmaos?: string;

  // Dados da Avaliação
  dataAvaliacao?: Date | null;
  avaliador?: string;
  local?: string;
  classificacao?: string;
  intercorrencias?: string;


  // Adicione estes campos na interface Prontuario no seu .ts:

// Gestação
numeroGestacao?: number | null;
gestacaoMultiplas?: string;
liquidoAmniotico?: string;
apresentacaoGestacao?: string;
intercorrenciasGestacao?: string;

// Parto e Pós-parto
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

// Rotina da Criança
dietaPatologias?: string;
atividadesDiarias?: string;
habilidadesMotoras?: string;
periodoSono?: string;
posicaoPreferencia?: string;
acompanhamentoFisioOsteo?: string;
desenvolvimentoCognitivo?: string;

// Queixa Principal
queixaPrincipal?: string;

cep?: string;
numComplemento?: string;


// Avaliação Postural
alinhamentoEstatico?: string;
controleCervicalTronco?: string;
tonusMuscular?: string;

// ALBERTA (AIMS)
scoreProno?: number | null;
scoreSupino?: number | null;
scoreSentado?: number | null;
scoreEmPe?: number | null;
scoreTotalAlberta?: number | null;
percentilAlberta?: string;
classificacaoAlberta?: string;
obsAlberta?: string;
marcosPronoSelecionados?: number[];

  historicoEvolucoes?: EvolucaoClinica[];
}

export interface EvolucaoClinica {
  id?: number;
  prontuarioId?: number;          // Vínculo com o paciente correspondente
  dataConsulta?: Date | null;     // Data da sessão (editável)
  fisioterapeuta?: string;        // Nome da fisio que fez o atendimento
  comoChegou?: string;
  procedimento?: string;
  comoSaiu?: string;

}

interface MarcoMotor {
  valor: number;
  imagem: string;
  descricao: string;
  tempoMin: string; // Linha roxa/superior da imagem
  tempoMax: string; // Linha verde/inferior da imagem
}