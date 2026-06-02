import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Agendamento, AgendamentoService } from '../../service/agendamento.service';
import { Prontuario } from '../../model/iprontuario.compoent';
import { ProntuarioService } from '../../service/prontuario.sevice';


@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss',
  providers: [MessageService]
})
export class AgendamentoComponent implements OnInit {

  listaAgendamentos: Agendamento[] = [];
  listaPacientes: Prontuario[] = [];
  
  agendaDialog = false;
  loading = false;
  
  agendamento: Agendamento = {};
  
  statusOptions = [
    { label: 'Agendado', value: 'Agendado' },
    { label: 'Confirmado', value: 'Confirmado' },
    { label: 'Cancelado', value: 'Cancelado' },
    { label: 'Finalizado', value: 'Finalizado' }
  ];

  tipoSessaoOptions = [
    { label: 'Avaliação Inicial', value: 'Avaliação Inicial' },
    { label: 'Avaliação Escala Alberta (AIMS)', value: 'Avaliação Escala Alberta' },
    { label: 'Evolução Fisioterapêutica', value: 'Evolução Fisioterapêutica' },
    { label: 'Retorno', value: 'Retorno' }
  ];

  constructor(
    private agendamentoService: AgendamentoService,
    private prontuarioService: ProntuarioService,
    private messageService: MessageService
  ) { }



  // Novas propriedades de controle de dados da agenda
dataFiltro: Date | null = new Date(); // Inicializa focando no dia atual (02/06/2026)
listaAgendamentosFiltrados: Agendamento[] = [];

// ... Mantenha o construtor e as definições de dropdowns idênticas ...

ngOnInit(): void {
  this.carregarDados();
}


// LÓGICA DE FILTRAGEM DE DATA (Desconsiderando a hora no cruzamento)
onFiltrarPorData(): void {
  if (!this.dataFiltro) {
    this.listaAgendamentosFiltrados = [...this.listaAgendamentos];
    return;
  }

  const dataAlvo = new Date(this.dataFiltro);

  this.listaAgendamentosFiltrados = this.listaAgendamentos.filter(agendamento => {
    const dataAgendada = new Date(agendamento.dataHoraInicio as Date);
    
    // Compara apenas Ano, Mês e Dia
    return dataAgendada.getDate() === dataAlvo.getDate() &&
           dataAgendada.getMonth() === dataAlvo.getMonth() &&
           dataAgendada.getFullYear() === dataAlvo.getFullYear();
  });
}

// BOTOES DE NAVEGAÇÃO DE DIAS
onVoltarDia(): void {
  if (!this.dataFiltro) this.dataFiltro = new Date();
  
  const novaData = new Date(this.dataFiltro);
  novaData.setDate(novaData.getDate() - 1);
  this.dataFiltro = novaData;
  
  this.onFiltrarPorData();
}

onAvancarDia(): void {
  if (!this.dataFiltro) this.dataFiltro = new Date();

  const novaData = new Date(this.dataFiltro);
  novaData.setDate(novaData.getDate() + 1);
  this.dataFiltro = novaData;
  
  this.onFiltrarPorData();
}

onLimparFiltroData(): void {
  this.dataFiltro = null;
  this.onFiltrarPorData();
}

// Ao salvar um novo agendamento, garanta que atualizamos a lista filtrada também


  carregarDados(): void {
    this.loading = true;
    
    // Carrega os agendamentos e a lista de pacientes simultaneamente
    this.agendamentoService.getAgendamentos().subscribe({
      next: (dados) => {
        this.listaAgendamentos = dados.map(item => ({
          ...item,
          dataHoraInicio: new Date(item.dataHoraInicio as string),
          dataHoraFim: new Date(item.dataHoraFim as string)
        }));
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar agenda.' });
        this.loading = false;
      }
    });

    this.prontuarioService.getProntuarios().subscribe({
      next: (dados) => this.listaPacientes = dados
    });
  }

  onNovoAgendamento(): void {
    this.agendamento = {
      prontuarioId: null,
      nomePaciente: '',
      dataHoraInicio: new Date(),
      dataHoraFim: new Date(new Date().getTime() + (60 * 60 * 1000)), // +1 hora padrão
      profissional: 'Dra Eliane Alves de Oliveira Juvenal',
      tipoSessao: 'Avaliação Escala Alberta',
      status: 'Agendado',
      observacoes: ''
    };
    this.agendaDialog = true;
  }

  onEditarAgendamento(agendado: Agendamento): void {
    this.agendamento = { ...agendado };
    this.agendaDialog = true;
  }

  onSelecionarPaciente(event: any): void {
    // Vincula o nome do paciente automaticamente ao selecionar pelo Dropdown de Prontuários
    const paciente = this.listaPacientes.find(p => p.id === event.value);
    if (paciente) {
      this.agendamento.nomePaciente = paciente.nome;
    }
  }

  onSalvarAgendamento(): void {
    if (!this.agendamento.prontuarioId || !this.agendamento.dataHoraInicio) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return;
    }

    if (this.agendamento.id) {
      const idx = this.listaAgendamentos.findIndex(a => a.id === this.agendamento.id);
      this.listaAgendamentos[idx] = this.agendamento;
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento atualizado.' });
    } else {
      this.agendamento.id = this.listaAgendamentos.length + 1;
      this.listaAgendamentos.push(this.agendamento);
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Paciente agendado com sucesso.' });
    }

    this.listaAgendamentos = [...this.listaAgendamentos];
    this.agendaDialog = false;
  }

 // Retorna a figura/ícone ideal para cada situação da agenda
getStatusIcon(status: string | undefined): string {
  switch (status) {
    case 'Confirmado': 
      return 'pi pi-check-circle'; // Círculo com check
    case 'Agendado': 
      return 'pi pi-clock';        // Relógio de espera
    case 'Cancelado': 
      return 'pi pi-times-circle'; // Ícone de "X" para cancelados
    case 'Finalizado': 
      return 'pi pi-verified';     // Selo de concluído/verificado
    default: 
      return 'pi pi-info-circle';  // Ícone informativo padrão
  }
}
}