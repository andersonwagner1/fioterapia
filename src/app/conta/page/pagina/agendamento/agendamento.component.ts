import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AgendamentoService } from '../../../service/agendamento.service';
import { Prontuario } from '../../../model/iprontuario.component';
import { ProntuarioService } from '../../../service/prontuario.sevice';
import { BasePermissaoComponent } from '../../base-permissao.component';
import { Agendamento } from 'src/app/conta/model/iagendamento.component';
import { AgendamentoDto } from 'src/app/conta/model/dto/iagendamento.component';
import { UsuarioService } from 'src/app/conta/service/usuario.sevice';
import { AgendamentoRespostaDto } from 'src/app/conta/model/dto/iagendamentoResposta.component';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss',
  providers: [MessageService]
})
export class AgendamentoComponent extends BasePermissaoComponent implements OnInit {
  
  protected override telaId = 'agenda' as const;  
  listaAgendamentos: Agendamento[] = [];
  listaPacientes: Prontuario[] = [];
  
  agendaDialog = false;
  loading = false;
  
  // Inicialização defensiva para evitar erros de leitura no primeiro carregamento do HTML
  agendamento: AgendamentoDto = {
    id: undefined,
    tipoSessao: '',
    icSituacao: 'Agendado',
    dsObservacaoQueixas: '',
    paciente: { id: undefined, nome: '' },
    dtHoraInicial: undefined,
    dtHoraFinal: undefined,
    usuario: {
      id:undefined,
      nome:undefined,
    }
  };
  
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

  dataFiltro: Date | null = new Date(); 
  listaAgendamentosFiltrados: AgendamentoRespostaDto[] = [];

  constructor(
    private agendamentoService: AgendamentoService,
    private prontuarioService: ProntuarioService,
    private usuariosService: UsuarioService,
    private messageService: MessageService
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit(); 
    this.carregarDados();
  }

  onFiltrarPorData(): void {
    this.agendamentoService.consultarAgendamentoPorData(this.dataFiltro).subscribe({
      next: (dados) => {
        
        this.listaAgendamentosFiltrados = dados;
        this.loading = false;


      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar agenda.' });
        this.loading = false;
      }
    });
  }

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

  carregarDados(): void {
    this.loading = true;

    this.onFiltrarPorData();
    
   

    this.prontuarioService.getProntuarios().subscribe({
      next: (dados) => this.listaPacientes = dados
    });
  }

  onNovoAgendamento(): void {
    // 💡 Corrigido: Inicializa o sub-objeto paciente em vez de null para não quebrar o formulário
    this.agendamento = {

        id : undefined,
        dtHoraInicial: undefined,
        dtHoraFinal: undefined,
      
      
        tipoSessao: "string",
        icSituacao : "string",
      
        dsObservacaoQueixas : "string",
  
        usuario : {
          id: undefined,
          nome: ''
        },
  
      paciente: {
        id: undefined,
        nome: ''
      }
    };
    
    this.agendaDialog = true;
  }


  onAbrirProntuario(agendado : AgendamentoDto): void{
     this.agendamentoService.getAgendamentoById(agendado.id).subscribe({
      next: (dados) => {
         this.router.navigate([`/pages/prontuario/${dados.paciente.id}`]);
    
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao consultar a agendamento por ID' });
        this.loading = false;
      }
    }); 
  }

  onEditarAgendamento(agendado: AgendamentoDto): void {
      this.agendamentoService.getAgendamentoById(agendado.id).subscribe({
      next: (dados) => {
        this.agendamento.id = dados.id;
        this.agendamento.paciente.id = dados.paciente.id;
        this.agendamento.paciente.nome = dados.paciente.nome;
        this.agendamento.dsObservacaoQueixas ; 
        this.agendamento.dtHoraFinal = new Date(dados.dataHoraFim);
        this.agendamento.dtHoraInicial = new Date(dados.dataHoraInicio);
        this.agendamento.icSituacao = dados.status
        this.agendamento.tipoSessao = dados.tipoSessao;

        this.agendamento.usuario.id = dados.usuario.id;
        this.agendamento.usuario.nome = dados.usuario.nome;
    
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'erro ao salvar registro de agenda' });
        this.loading = false;
      }
    }); 




    this.agendaDialog = true;
  }

  onSalvarAgendamento(): void {


    this.agendamentoService.salvar(this.agendamento).subscribe({
      next: (dados) => {
       
        
        // 💡 Ajuste: Filtra os dados assim que eles chegam da API para alimentar a tabela
        this.onFiltrarPorData(); 
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Agenda', detail: 'Agendado com sucesso' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'erro ao salvar registro de agenda' });
        this.loading = false;
      }
    });
  }

  getStatusIcon(status: string | undefined): string {
    switch (status) {
      case 'Confirmado': return 'pi pi-check-circle';
      case 'Agendado': return 'pi pi-clock';
      case 'Cancelado': return 'pi pi-times-circle';
      case 'Finalizado': return 'pi pi-verified';
      default: return 'pi pi-info-circle';
    }
  }

  /**
   * Executa a busca dinâmica na lista local com base no nome digitado
   */
  abrirPesquisaPacientes(): void {
    if (!this.agendamento.paciente?.nome) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Digite parte do nome para pesquisar.' });
      return;
    }
    
    const termo = this.agendamento.paciente.nome.toLowerCase().trim();
    const encontrado = this.listaPacientes.find(p => p.nome.toLowerCase().includes(termo));

    if (encontrado) {
      this.agendamento.paciente = {
        id: encontrado.id,
        nome: encontrado.nome,
        dataNascimento: encontrado.dataNascimento
      };
      this.messageService.add({ severity: 'info', summary: 'Paciente Encontrado', detail: encontrado.nome });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Não encontrado', detail: 'Nenhum paciente localizado com este nome.' });
    }
  }


   onBlurPacientePorProntuario(): void {
    if (!this.agendamento.paciente?.id) return;

    this.prontuarioService.getProntuarioById(this.agendamento.paciente.id).subscribe({
      next: (usuario) => {
        if (usuario) { 
          // 💡 Ajuste: Injeta o prontuário encontrado atualizando o input do nome automaticamente
          this.agendamento.paciente = usuario;
          this.messageService.add({ severity: 'success', summary: 'Prontuário Vinculado', detail: usuario.nome });
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Não encontrado', detail: `Nenhum prontuário com o número ${this.agendamento.paciente?.id}.` });
          if (this.agendamento.paciente) {
            this.agendamento.paciente.nome = '';
          }
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar dados do prontuário.' });
        console.error(err);
      }
    });
  }


  /**
   * Busca os dados completos do paciente ao digitar o número do Prontuário e sair do campo
   */
  onBlurPacientePorUsuario() : void {
    
    this.usuariosService.getUsuarioById(this.agendamento.usuario.id).subscribe({
      next: (usuario) => {
        if (usuario) { 
          // 💡 Ajuste: Injeta o prontuário encontrado atualizando o input do nome automaticamente
          this.agendamento.usuario = usuario;
        
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Não encontrado', detail: `Nenhum prontuário com o número ${this.agendamento.paciente?.id}.` });
          if (this.agendamento.paciente) {
            this.agendamento.paciente.nome = '';
          }
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar dados do prontuário.' });
        console.error(err);
      }
    });
  }
}