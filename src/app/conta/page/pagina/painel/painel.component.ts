import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AgendamentoService } from '../../../service/agendamento.service';
import { ProntuarioService } from '../../../service/prontuario.sevice';
import { Router } from '@angular/router';
import { Agendamento } from 'src/app/conta/model/iagendamento.component';

// Interface auxiliar para tipar o objeto de data enviado pelo template do PrimeNG
interface PrimeNgDate {
  day: number;
  month: number;
  year: number;
}

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.scss'
})
export class PainelComponent implements OnInit {

  totalPacientesCadastrados = 0;
  consultasMes = 0;
  consultasConfirmadas = 0;
  consultasCanceladas = 0;

  loading = false;
  dataAtual = new Date();
  listaAgendamentos: Agendamento[] = [];
  
  // Dicionário para busca rápida de agendamentos por data O(1)
  private agendamentosPorDataMap = new Map<string, Agendamento[]>();

  constructor(
    private agendamentoService: AgendamentoService,
    private prontuarioService: ProntuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarDadosPainel();
  }

  irParaProntuario(prontuarioId: number | undefined): void {
    //if (prontuarioId) {
      this.router.navigate(['/pages/prontuario', prontuarioId]);
    //} else {
     // console.warn('Este agendamento não possui um prontuário vinculado.');
    //}
  }

  carregarDadosPainel(): void {
    this.loading = true;

    // Executa as requisições em paralelo de forma limpa e segura
    forkJoin({
      prontuarios: this.prontuarioService.getProntuarios(),
      agendamentos: this.agendamentoService.getListaAgendamentosAguardandoAtendimento()
    }).subscribe({
      next: ({ prontuarios, agendamentos }) => {
        this.totalPacientesCadastrados = prontuarios.length;
        this.listaAgendamentos = agendamentos;
        console.log(this.listaAgendamentos)
        ;
        this.consultasMes = agendamentos.filter(a => a.icSituacao === 'Confirmado' || a.icSituacao === 'Agendado').length;        
        this.consultasConfirmadas = agendamentos.filter(a => a.icSituacao === 'Confirmado' || a.icSituacao === 'Finalizado').length;
        this.consultasCanceladas = agendamentos.filter(a => a.icSituacao === 'Cancelado').length;

        this.inicializarMapeamentoEAtendimentos();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao processar dados do painel:', err);
        this.loading = false;
      }
    });
  }

  private inicializarMapeamentoEAtendimentos(): void {
    this.agendamentosPorDataMap.clear();

    this.listaAgendamentos.forEach(agenda => {
      //const data = agenda.dataHoraInicio as Date;
      //const chaveStr = this.gerarChaveData(data.getFullYear(), data.getMonth(), data.getDate());
      
      /*if (!this.agendamentosPorDataMap.has(chaveStr)) {
        this.agendamentosPorDataMap.set(chaveStr, []);
      }
      this.agendamentosPorDataMap.get(chaveStr)?.push(agenda);*/
    });

    this.calcularKpis();
  }

  obterPacientesDoDia(date: PrimeNgDate): Agendamento[] {
    const chave = this.gerarChaveData(date.year, date.month, date.day);
    return this.agendamentosPorDataMap.get(chave) || [];
  }

  verificarSePossuiAgendamentoNoDia(date: PrimeNgDate): boolean {
    const pacientes = this.obterPacientesDoDia(date);
    return pacientes.some(a => a.status !== 'Cancelado');
  }

  verificarSePossuiCancelamentoNoDia(date: PrimeNgDate): boolean {
    const pacientes = this.obterPacientesDoDia(date);
    return pacientes.some(a => a.status === 'Cancelado');
  }

  obterDicaTooltipPacientes(date: PrimeNgDate): string {
    const pacientesDoDia = this.obterPacientesDoDia(date);
    if (!pacientesDoDia.length) return 'Nenhum paciente marcado';

    return 'Pacientes:\n' + pacientesDoDia.map(p => `- ${p.paciente.nome} (${p.status})`).join('\n');
  }

  private calcularKpis(): void {

  }

  // Método centralizador de chaves para evitar divergências de fuso horário
  private gerarChaveData(ano: number, mes: number, dia: number): string {
    return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  }
}