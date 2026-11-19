import { Component, OnInit } from '@angular/core';
import { ProntuarioService } from '../../../service/prontuario.sevice';
import { Prontuario } from '../../../model/iprontuario.component';
import { CRANIOMETRIA_MOCK } from './craniometria.mock';

export interface CraniometriaAvaliacao {
  paciente: string;
  registro: string;
  dataAvaliacao: string;
  comprimento: number | null;
  largura: number | null;
  diagonalMaior: number | null;
  diagonalMenor: number | null;
  argenta: string;
  observacoes: string;
  percentilMotor: number | null;
}

export interface CraniometriaSessao {
  data: string;
  cvai: number | null;
  ic: number | null;
  percentilMotor: number | null;
  argenta: string;
  observacoes: string;
}

@Component({
  selector: 'app-craniometria',
  templateUrl: './craniometria.component.html',
  styleUrls: ['./craniometria.component.scss']
})
export class CraniometriaComponent implements OnInit {
  readonly storageKey = 'craniometria_avaliacao_v1';
  readonly argentaOptions = ['Não avaliado', 'Tipo I', 'Tipo II', 'Tipo III', 'Tipo IV', 'Tipo V'];
  avaliacao: CraniometriaAvaliacao = this.novaAvaliacao();
  mensagem = '';
  nomePacienteBusca = '';
  pacientesEncontrados: Prontuario[] = [];
  pacienteSelecionado: Prontuario | null = null;
  buscandoPaciente = false;
  modalPesquisaPaciente = false;
  mensagemBuscaPaciente = '';
  historicoPaciente: CraniometriaSessao[] = [];
  relatorioVisivel = false;

  constructor(private prontuarioService: ProntuarioService) {}

  ngOnInit(): void {
    this.carregar();
  }

  get cvai(): number | null {
    if (!this.temMedidas(this.avaliacao.diagonalMaior, this.avaliacao.diagonalMenor) || this.avaliacao.diagonalMenor === 0) return null;
    return ((this.avaliacao.diagonalMaior! - this.avaliacao.diagonalMenor!) / this.avaliacao.diagonalMenor!) * 100;
  }

  get ic(): number | null {
    if (!this.temMedidas(this.avaliacao.largura, this.avaliacao.comprimento) || this.avaliacao.comprimento === 0) return null;
    return (this.avaliacao.largura! / this.avaliacao.comprimento!) * 100;
  }

  get classificacaoCvai(): string {
    if (this.cvai === null) return 'Informe as diagonais';
    if (this.cvai < 3.5) return 'Sem assimetria significativa';
    if (this.cvai < 6.25) return 'Leve';
    if (this.cvai < 8.75) return 'Moderada';
    return 'Severa';
  }

  get classificacaoIc(): string {
    if (this.ic === null) return 'Informe comprimento e largura';
    if (this.ic < 90) return 'Sem braquicefalia';
    if (this.ic < 95) return 'Leve';
    if (this.ic < 100) return 'Moderada';
    return 'Severa';
  }

  carregarMock(): void {
    this.avaliacao = { ...CRANIOMETRIA_MOCK };
    this.mensagem = 'Mock carregado. Os valores são fictícios e servem apenas para teste.';
    this.salvar();
  }

  abrirModalPesquisaPaciente(): void {
    this.modalPesquisaPaciente = true;
    this.mensagemBuscaPaciente = '';
  }

  fecharModalPesquisaPaciente(): void {
    this.modalPesquisaPaciente = false;
  }

  buscarPacientes(): void {
    const nome = this.nomePacienteBusca.trim();
    if (!nome) {
      this.pacientesEncontrados = [];
      this.mensagem = 'Informe o nome do paciente para pesquisar.';
      this.mensagemBuscaPaciente = this.mensagem;
      return;
    }

    this.buscandoPaciente = true;
    this.prontuarioService.listarProntuariosPorFiltro({ nome }).subscribe({
      next: pacientes => {
        this.pacientesEncontrados = pacientes || [];
        this.buscandoPaciente = false;
        this.mensagemBuscaPaciente = this.pacientesEncontrados.length
          ? 'Selecione um paciente cadastrado para carregar seus dados.'
          : 'Nenhum paciente encontrado para o nome informado.';
        this.mensagem = this.pacientesEncontrados.length
          ? 'Selecione um paciente cadastrado para carregar seus dados.'
          : 'Nenhum paciente encontrado para o nome informado.';
      },
      error: () => {
        this.pacientesEncontrados = [];
        this.buscandoPaciente = false;
        this.mensagemBuscaPaciente = 'Não foi possível consultar os pacientes cadastrados.';
        this.mensagem = 'Não foi possível consultar os pacientes cadastrados.';
      }
    });
  }

  selecionarPaciente(paciente: Prontuario): void {
    if (!paciente.id) {
      this.mensagem = 'O paciente selecionado não possui identificador.';
      return;
    }

    this.buscandoPaciente = true;
    this.prontuarioService.getProntuarioById(paciente.id).subscribe({
      next: dados => {
        if (!dados) {
          this.mensagem = 'Não foi possível carregar os dados do paciente.';
          this.buscandoPaciente = false;
          return;
        }

        this.pacienteSelecionado = dados;
        this.avaliacao.paciente = dados.nome || '';
        this.avaliacao.registro = String(dados.id);
        this.carregarHistoricoPaciente(dados.id);
        this.mensagem = `Paciente ${dados.nome || ''} carregado com sucesso.`;
        this.pacientesEncontrados = [];
        this.buscandoPaciente = false;
        this.modalPesquisaPaciente = false;
      },
      error: () => {
        this.mensagem = 'Não foi possível carregar os dados do paciente selecionado.';
        this.buscandoPaciente = false;
      }
    });
  }

  nova(): void {
    this.avaliacao = this.novaAvaliacao();
    this.nomePacienteBusca = '';
    this.pacientesEncontrados = [];
    this.pacienteSelecionado = null;
    this.modalPesquisaPaciente = false;
    this.mensagemBuscaPaciente = '';
    this.mensagem = 'Avaliação limpa.';
    localStorage.removeItem(this.storageKey);
  }

  salvar(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.avaliacao));
    if (this.pacienteSelecionado?.id) {
      const sessao: CraniometriaSessao = {
        data: this.avaliacao.dataAvaliacao,
        cvai: this.cvai,
        ic: this.ic,
        percentilMotor: this.avaliacao.percentilMotor,
        argenta: this.avaliacao.argenta,
        observacoes: this.avaliacao.observacoes
      };
      this.historicoPaciente = [...this.historicoPaciente, sessao].sort((a, b) => a.data.localeCompare(b.data));
      this.salvarHistoricoPaciente();
    }
    this.mensagem = 'Avaliação salva neste navegador.';
  }

  abrirRelatorio(): void {
    if (this.historicoPaciente.length < 1) {
      this.mensagem = 'Salve pelo menos uma avaliação para gerar o relatório.';
      return;
    }
    this.relatorioVisivel = true;
  }

  imprimirRelatorio(): void {
    window.print();
  }

  pontosGrafico(metrica: 'cvai' | 'ic' | 'percentilMotor', largura = 460, altura = 150): string {
    if (!this.historicoPaciente.length) return '';
    const maximo = this.maximoGrafico(metrica);
    const passo = this.historicoPaciente.length === 1 ? 0 : largura / (this.historicoPaciente.length - 1);
    return this.historicoPaciente.map((sessao, indice) => {
      const valor = sessao[metrica] ?? 0;
      const x = 20 + (indice * passo);
      const y = 10 + altura - ((valor / maximo) * altura);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }

  valorGrafico(sessao: CraniometriaSessao, metrica: 'cvai' | 'ic' | 'percentilMotor'): number {
    return sessao[metrica] ?? 0;
  }

  private maximoGrafico(metrica: 'cvai' | 'ic' | 'percentilMotor'): number {
    if (metrica === 'percentilMotor') return 100;
    if (metrica === 'ic') return Math.max(110, ...this.historicoPaciente.map(sessao => sessao.ic || 0));
    return Math.max(10, ...this.historicoPaciente.map(sessao => sessao.cvai || 0));
  }

  private carregarHistoricoPaciente(id: number): void {
    try {
      const dados = localStorage.getItem(`craniometria_historico_${id}`);
      this.historicoPaciente = dados ? JSON.parse(dados) : [];
    } catch {
      this.historicoPaciente = [];
    }
  }

  private salvarHistoricoPaciente(): void {
    if (this.pacienteSelecionado?.id) {
      localStorage.setItem(`craniometria_historico_${this.pacienteSelecionado.id}`, JSON.stringify(this.historicoPaciente));
    }
  }

  private novaAvaliacao(): CraniometriaAvaliacao {
    return {
      paciente: '', registro: '', dataAvaliacao: new Date().toISOString().slice(0, 10),
      comprimento: null, largura: null, diagonalMaior: null, diagonalMenor: null, percentilMotor: null,
      argenta: 'Não avaliado', observacoes: ''
    };
  }

  private carregar(): void {
    try {
      const dados = localStorage.getItem(this.storageKey);
      if (dados) this.avaliacao = { ...this.novaAvaliacao(), ...JSON.parse(dados) };
    } catch {
      this.avaliacao = this.novaAvaliacao();
    }
  }

  private temMedidas(...medidas: Array<number | null>): boolean {
    return medidas.every(medida => medida !== null && medida !== undefined && medida >= 0);
  }
}
