import { Component, OnInit } from '@angular/core';



// PrimeNG Services
import { MessageService, ConfirmationService } from 'primeng/api';


// Interface opcional para tipar o modelo, facilitando a legibilidade
export interface Prontuario {
  id?: number;
  dataAvaliacao?: Date | null;
  avaliador?: string;
  local?: string;
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
  mae?: string;
  idadeMae?: number | null;
  profissaoMae?: string;
  contatoMae?: string;
  pai?: string;
  idadePai?: number | null;
  profissaoPai?: string;
  contatoPai?: string;
  irmaos?: string;
  numeroGestacao?: string;
  gestacaoMultiplas?: string;
  liquidoAmniotico?: string;
  tipoParto?: string;
  intercorrencias?: string;
  atividadesDiarias?: string;
  qualidadeSono?: string;
  prono?: string;
  supino?: string;
  percentil?: string;
  classificacao?: string;
  reflexosPrimitivos?: string;
}


@Component({
  selector: 'app-prontuario-lista',
 
  templateUrl: './prontuario-lista.component.html',
  styleUrl: './prontuario-lista.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class ProntuarioListaComponent implements OnInit {
 
  // Variáveis de controle de estado exigidas pelo novo padrão HTML
  titulo = 'Gerenciamento de Prontuários';
  loading = false;
  telaRegistro = false;
  telaConfirmacaoRegistroSelecionado = false;
  telaConfirmacaoExclusao = false;
 
  // Listas de dados
  listaRegistros: Prontuario[] = [];
  registrosSelecionados: Prontuario[] = [];
 
  // Objeto que unifica os campos do formulário (Substitui os campos soltos antigos)
  registro!: Prontuario;


  sexoOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' }
  ];


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }


  ngOnInit(): void {
    this.carregarProntuarios();
  }


  // Simulação de carga inicial dos dados
  carregarProntuarios(): void {
    this.listaRegistros = [
      {
        id: 1,
        nome: 'João Silva',
        dataAvaliacao: new Date(),
        avaliador: 'Dr. Anderson',
        classificacao: 'Desenvolvimento Normal'
      }
    ];
  }


  // --- AÇÕES DA BARRA DE FERRAMENTAS & TABELA ---


  onAbrirTelaNovoRegistro(): void {
    // Inicializa o objeto de registro limpo para inserção
    this.registro = {
      dataAvaliacao: new Date(),
      dataNascimento: null,
      avaliador: '',
      local: '',
      nome: '',
      sexo: null,
      idadeCronologica: '',
      igc: '',
      pesoAtual: null,
      comprimento: null,
      pc: '',
      pediatra: '',
      endereco: '',
      mae: '',
      idadeMae: null,
      profissaoMae: '',
      contatoMae: '',
      pai: '',
      idadePai: null,
      profissaoPai: '',
      contatoPai: '',
      irmaos: '',
      numeroGestacao: '',
      gestacaoMultiplas: '',
      liquidoAmniotico: '',
      tipoParto: '',
      intercorrencias: '',
      atividadesDiarias: '',
      qualidadeSono: '',
      prono: '',
      supino: '',
      percentil: '',
      classificacao: '',
      reflexosPrimitivos: ''
    };
    this.telaRegistro = true;
  }


  onEditarRegistro(prod: Prontuario): void {
    // Clona o registro selecionado para evitar mutação direta na tabela antes de salvar
    this.registro = { ...prod };
    this.telaRegistro = true;
  }


  onAbrirBancoConta(prod: Prontuario): void {
    // Função disparada pelo botão "Visualizar" (pi-eye)
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


  // --- MÉTODOS DE PERSISTÊNCIA (SALVAR / EXCLUIR) ---


  onSalvarRegistro(): void {
    this.loading = true;


    // Se possui ID atualiza a lista existente, senão simula a criação de um novo ID
    if (this.registro.id) {
      const index = this.listaRegistros.findIndex(item => item.id === this.registro.id);
      this.listaRegistros[index] = this.registro;
     
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Prontuário atualizado com sucesso'
      });
    } else {
      this.registro.id = this.listaRegistros.length + 1;
      this.listaRegistros.push(this.registro);


      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Prontuário cadastrado com sucesso'
      });
    }


    // Força atualização da listagem e fecha a modal
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
