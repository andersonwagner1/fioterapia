import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProntuarioService } from '../../../service/prontuario.sevice';
import { Prontuario } from '../../../model/iprontuario.compoent';
import { ProntuarioFormComponent } from '../prontuario/prontuarioForm.component';
import { Router, Routes } from '@angular/router';


@Component({
  selector: 'app-prontuario-lista',
  templateUrl: './prontuario-lista.component.html',
  styleUrl: './prontuario-lista.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class ProntuarioListaComponent implements OnInit {
  
  titulo = 'Gerenciamento de Prontuários';
  loading = false;
  telaRegistro = false;
  telaConfirmacaoRegistroSelecionado = false;
  telaConfirmacaoExclusao = false;
  
  listaRegistros: Prontuario[] = [];
  registrosSelecionados: Prontuario[] = [];
  registro!: Prontuario;

  sexoOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' }
  ];

  // Injeção do ProntuarioService no construtor
  constructor(
    private prontuarioService: ProntuarioService, 
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router // <-- Injete o Router aqui
  ) { }

  ngOnInit(): void {
    this.carregarProntuarios();
  }

  // Chamada do serviço consumindo o JSON assincronamente
  carregarProntuarios(): void {
    this.loading = true;
    this.prontuarioService.getProntuarios().subscribe({
      next: (dados) => {
        this.listaRegistros = dados;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro de Carregamento',
          detail: 'Não foi possível ler a base de dados de teste.'
        });
        this.loading = false;
        console.error('Erro ao ler JSON de testes:', err);
      }
    });
  }

  // --- AÇÕES DA BARRA DE FERRAMENTAS & TABELA ---

  onAbrirTelaNovoRegistro(): void {
    this.router.navigate(['/pages/prontuario']);
  }

 onEditarRegistro(prod: Prontuario): void {
  if (prod.id) {
      // Navega nativamente para a URL /pages/prontuario/ID
      this.router.navigate([`/pages/prontuario/${prod.id}`]);
    }


 
}

  onAbrirBancoConta(prod: Prontuario): void {
    this.registro = { ...prod };
    this.telaRegistro = true;
  }

  onConfirmarExclusaoRegistro(prod: Prontuario): void {
    this.registro = { ...prod };
    this.telaConfirmacaoRegistroSelecionado = true;
  }

  onAbrirTelaConfirmacaoExclusaoRegistro(): void {
    this.telaConfirmacaoExclusao = true;
  }

  esconderCaixaDialogo(): void {
    this.telaRegistro = false;
  }

  onFiltragemRapida(dt: any, event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    dt.filterGlobal(filterValue, 'contains');
  }

  // --- MÉTODOS DE PERSISTÊNCIA SIMULADA ---

  onSalvarRegistro(): void {
    this.loading = true;

    if (this.registro.id) {
      const index = this.listaRegistros.findIndex(item => item.id === this.registro.id);
      this.listaRegistros[index] = this.registro;
      
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Prontuário atualizado localmente'
      });
    } else {
      this.registro.id = this.listaRegistros.length + 1;
      this.listaRegistros.push(this.registro);

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Prontuário cadastrado localmente'
      });
    }

    this.listaRegistros = [...this.listaRegistros];
    this.telaRegistro = false;
    this.loading = false;
  }

  confirmarExclusaoRegistro(): void {
    this.listaRegistros = this.listaRegistros.filter(val => val.id !== this.registro.id);
    this.telaConfirmacaoRegistroSelecionado = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Prontuário excluído com sucesso',
      life: 3000
    });
  }

  onConfirmarExclusaoRegistroSelecionado(): void {
    this.listaRegistros = this.listaRegistros.filter(val => !this.registrosSelecionados.includes(val));
    this.registrosSelecionados = [];
    this.telaConfirmacaoExclusao = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Prontuários excluídos com sucesso',
      life: 3000
    });
  }
}