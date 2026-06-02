import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { EvolucaoClinica, MarcoMotor, Prontuario } from '../../model/iprontuario.compoent';
import { ActivatedRoute, Router } from '@angular/router';
import { ProntuarioService } from '../../service/prontuario.sevice';


@Component({
  selector: 'app-prontuario-form',
  templateUrl: './prontuarioForm.component.html',
  styleUrl: './prontuarioForm.component.scss',
  providers: [MessageService, MensagemAvisoService]
})
export class ProntuarioFormComponent implements OnInit {

  // Controle de Estado e Telas
  exibindoFormEvolucao: boolean = false;
  telaConfirmacaoRegistroSelecionado: boolean = false;
  telaConfirmacaoExclusao: boolean = false;
  telaRegistro: boolean = false;
  telaExclusao: boolean = false;
  loading: boolean = false;
  carregandoCep: boolean = false;

  // Dados Estáticos e Autenticação
  profissionalLogado = 'Dra Eliane Alves de Oliveira Juvenal';

  // Armazenamento Temporário de Endereço
  dadosEnderecoLogradouro = '';
  dadosEnderecoBairro = '';
  dadosEnderecoCidade = '';
  dadosEnderecoUf = '';

  // Objeto Principal de Dados (Inicializado tipado com segurança)
  registro: Prontuario = {};

  // Controle de visibilidade em duas vias (Two-way Data Binding)
  @Input() visivel = false;
  @Output() visivelChange = new EventEmitter<boolean>();

  // Eventos emitidos para o componente Pai
  @Output() salvar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  // Opções de Seleção Fixas (Dropdowns)
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

  // Estrutura de Atendimento Temporário
  novaEvolucao: EvolucaoClinica = {};

  // Tabelas de Referência Clínica - Escala Alberta (AIMS)
  listaMarcosProno: MarcoMotor[] = [
    { valor: 1, descricao: 'Flexão fisiológica em prono', tempoMin: '-', tempoMax: '-' },
    { valor: 2, descricao: 'Extensão cervical inicial', tempoMin: '15d', tempoMax: '2m' },
    { valor: 3, descricao: 'Sustentação de antebraço baixa', tempoMin: '1m10d', tempoMax: '2m25d' },
    { valor: 4, descricao: 'Elevação de tronco com controle', tempoMin: '2m15d', tempoMax: '3m20d' },
    { valor: 5, descricao: 'Extensão com apoio de mãos', tempoMin: '3m', tempoMax: '4m' },
    { valor: 6, descricao: 'Cervical estável a 90 graus', tempoMin: '2m20d', tempoMax: '5m' },
    { valor: 7, descricao: 'Pivoteamento / Natação ativa', tempoMin: '4m10d', tempoMax: '6m' },
    { valor: 8, descricao: 'Rolamento prono para supino', tempoMin: '6m', tempoMax: '8m15d' },
    { valor: 9, descricao: 'Arrasto inicial com abdômen', tempoMin: '5m', tempoMax: '8m' },
    { valor: 10, descricao: 'Início de quatro apoios', tempoMin: '5m', tempoMax: '7m' },
    { valor: 11, descricao: 'Engatinhar definitivo recíproco', tempoMin: '5m20d', tempoMax: '8m55d' },
    { valor: 12, descricao: 'Flexão fisiológica avançada', tempoMin: '-', tempoMax: '-' },
    { valor: 13, descricao: 'Extensão cervical estável ampla', tempoMin: '15d', tempoMax: '2m' },
    { valor: 14, descricao: 'Apoio de antebraço simétrico', tempoMin: '1m10d', tempoMax: '2m25d' },
    { valor: 15, descricao: 'Sustentação escapular ativa', tempoMin: '2m15d', tempoMax: '3m20d' },
    { valor: 16, descricao: 'Extensão de cotovelos completa', tempoMin: '3m', tempoMax: '4m' },
    { valor: 17, descricao: 'Elevação de pelve/tronco', tempoMin: '2m20d', tempoMax: '5m' },
    { valor: 18, descricao: 'Movimentos de pivô lateral', tempoMin: '4m10d', tempoMax: '6m' },
    { valor: 19, descricao: 'Deslocamento em eixo / Rolamento', tempoMin: '6m', tempoMax: '8m15d' },
    { valor: 20, descricao: 'Propulsão em prono / Arrasto', tempoMin: '5m', tempoMax: '8m' },
    { valor: 21, descricao: 'Base para gato estável', tempoMin: '5m', tempoMax: '7m' },
    { valor: 22, descricao: 'Movimentação rápida / Engatinhar', tempoMin: '5m20d', tempoMax: '8m5' }
  ];

  listaMarcosSupino: MarcoMotor[] = [
    { valor: 1, descricao: 'Flexão fisiológica em supino', tempoMin: 'Nascer', tempoMax: '1m' },
    { valor: 2, descricao: 'Postura tônica cervical (RTCA)', tempoMin: '15d', tempoMax: '2m' },
    { valor: 3, descricao: 'Movimentos recíprocos de pernas', tempoMin: '1m', tempoMax: '3m' },
    { valor: 4, descricao: 'Controle de linha média de cabeça', tempoMin: '2m', tempoMax: '4m' },
    { valor: 5, descricao: 'Mãos ao corpo e linha média', tempoMin: '3m', tempoMax: '5m' },
    { valor: 6, descricao: 'Extensão active de pernas / Chutes', tempoMin: '4m', tempoMax: '6m' },
    { valor: 7, descricao: 'Mãos aos joelhos / Elevação pélvica', tempoMin: '4m15d', tempoMax: '7m' },
    { valor: 8, descricao: 'Mãos aos pés / Exploração sensorial', tempoMin: '5m', tempoMax: '8m' },
    { valor: 9, descricao: 'Rolamento supino para prono', tempoMin: '5m15d', tempoMax: '9m' }
  ];

  listaMarcosSentado: MarcoMotor[] = [
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

  listaMarcosEmPe: MarcoMotor[] = [
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

  constructor(
    private route: ActivatedRoute, // <-- Injete para capturar o :id da URL
    private router: Router,        // <-- Injete para poder voltar à lista
    private prontuarioService: ProntuarioService,
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
   let idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.carregarDadosDoProntuario(parseInt(idParam));
    } else {
      this.limparFormularioNovo();
    }
    
    // Inicialização segura das listas de controle de marcações
    this.garantirInicializacaoArraysMarcos();
  }

  limparFormularioNovo(): void {
    this.registro = {
      dataAvaliacao: new Date(),
      dataNascimento: null,
      nome: '',
      sexo: null,
      marcosPronoSelecionados: [],
      marcosSupinoSelecionados: [],
      marcosSentadoSelecionados: [],
      marcosEmPeSelecionados: [],
      historicoEvolucoes: []
    };
    this.dadosEnderecoLogradouro = '';
    this.dadosEnderecoBairro = '';
    this.dadosEnderecoCidade = '';
    this.dadosEnderecoUf = '';
  }

  onVoltar(): void {
    this.router.navigate(['/pages/lista-prontuario']); // Ajuste para o caminho real da sua listagem
  }

  carregarDadosDoProntuario(id: number): void {
    this.loading = true;
    this.prontuarioService.getProntuarioById(id).subscribe({
      next: (dados) => {
        if (dados) {
          this.registro = dados;
          this.garantirInicializacaoArraysMarcos();
          this.onCalcularIdadeCronologica();
          this.onCalcularClassificacaoAlberta();
        }
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar dados.' });
        this.loading = false;
      }
    });
  }

  private garantirInicializacaoArraysMarcos(): void {
    if (!this.registro.marcosPronoSelecionados) this.registro.marcosPronoSelecionados = [];
    if (!this.registro.marcosSupinoSelecionados) this.registro.marcosSupinoSelecionados = [];
    if (!this.registro.marcosSentadoSelecionados) this.registro.marcosSentadoSelecionados = [];
    if (!this.registro.marcosEmPeSelecionados) this.registro.marcosEmPeSelecionados = [];
  }

  // --- MÉTODOS DE HISTÓRICO E EVOLUÇÃO ---
  verificarSublistaHistorico(): void {
    if (!this.registro.historicoEvolucoes) {
      this.registro.historicoEvolucoes = [];
    }
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
    this.registro.historicoEvolucoes?.unshift({ ...this.novaEvolucao });
    
    this.exibindoFormEvolucao = false;
    this.novaEvolucao = {};

    this.messageService.add({
      severity: 'info',
      summary: 'Inclusão Local',
      detail: 'Sessão adicionada à lista temporal. Lembre-se de Salvar o prontuário para gravar definitivo.'
    });
  }

  // --- MÉTODOS DE IDADE E ENDEREÇO ---
  onCalcularIdadeCronologica(): void {
    if (!this.registro.dataNascimento) {
      this.registro.idadeCronologica = '';
      return;
    }

    const dataNasc = new Date(this.registro.dataNascimento);
    const hoje = new Date();

    if (dataNasc > hoje) {
      this.registro.idadeCronologica = 'Data de nascimento futura';
      return;
    }

    let anos = hoje.getFullYear() - dataNasc.getFullYear();
    let meses = hoje.getMonth() - dataNasc.getMonth();
    let dias = hoje.getDate() - dataNasc.getDate();

    if (dias < 0) {
      meses--;
      const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate();
      dias += ultimoDiaMesAnterior;
    }

    if (meses < 0) {
      anos--;
      meses += 12;
    }

    const strAnos = anos === 1 ? '1 ano' : `${anos} anos`;
    const strMeses = meses === 1 ? '1 mês' : `${meses} meses`;
    const strDias = dias === 1 ? '1 dia' : `${dias} dias`;

    this.registro.idadeCronologica = `${strAnos}, ${strMeses} e ${strDias}`;
  }

  buscarCep(): void {
    const cepLimpo = this.registro.cep?.replace(/\D/g, '');

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
          this.dadosEnderecoLogradouro = dados.logradouro;
          this.dadosEnderecoBairro = dados.bairro;
          this.dadosEnderecoCidade = dados.localidade;
          this.dadosEnderecoUf = dados.uf;

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

  // --- MÉTODOS COMPARTILHADOS ESCALA ALBERTA (AIMS) ---
  isMarcoSelecionado(subescala: string, valor: number): boolean {
    const fieldChave = `marcos${subescala.charAt(0).toUpperCase() + subescala.slice(1)}Selecionados`;
    return this.registro[fieldChave]?.includes(valor) || false;
  }

  onAlternarMarco(subescala: string, item: MarcoMotor): void {
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
      // Regra oficial AIMS: Pontuação pelo maior marco motor atingido
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
    this.onCalcularClassificacaoAlberta();
  }

  onCalcularClassificacaoAlberta(): void {
    const pct = this.registro.percentilAlberta !== null && this.registro.percentilAlberta !== undefined
      ? +this.registro.percentilAlberta 
      : null;

    if (pct === null || isNaN(pct)) {
      this.registro.classificacaoAlberta = '';
      return;
    }

    if (pct < 5) {
      this.registro.classificacaoAlberta = 'Atraso no Desenvolvimento Motor';
    } else if (pct >= 5 && pct <= 25) {
      this.registro.classificacaoAlberta = 'Alerta para o Desenvolvimento Motor';
    } else {
      this.registro.classificacaoAlberta = 'Desenvolvimento Motor Normal / Adequado';
    }
  }



/*
  onFechar(): void {
    this.visivel = false;
    this.visivelChange.emit(false);
    this.cancelar.emit();
  }*/

  onSalvar() { }
}

