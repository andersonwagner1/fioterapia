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
export class ProntuarioFormComponent implements OnInit {

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
  


  }

  calcularTotalAlberta(): void {
  const prono = this.registro.scoreProno || 0;
  const supino = this.registro.scoreSupino || 0;
  const sentado = this.registro.scoreSentado || 0;
  const emPe = this.registro.scoreEmPe || 0;

  // O escore total bruto máximo da AIMS é 58
  this.registro.scoreTotalAlberta = prono + supino + sentado + emPe;
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
}