import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';

// PrimeNG
import { MessageService } from 'primeng/api';

// Serviços
import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { ImportaService } from '../../service/importa.service';
import { TipoMovimentacaoService } from '../../service/tipo-movimentacao.service';
import { TransferenciaService } from '../../service/transferencia.service';

// Models
import { ITipoMovimentacao } from '../../model/i-tipo-movimentacao';
import { ITransferencia } from '../../model/i-transferencia';
import { IImportacao } from '../../model/i-importacao';
import { IImportacaoRegistro } from '../../model/i-importacao-registro';
import { BancoConta } from '../../model/banco-conta';
import { IInvestimento } from '../../model/i-investimento';
import { InvestimentoService } from '../../service/investimento.service';

// Interfaces Locais (Melhor organização)
/**
 * Interface para a tabela de relações Cliente X Pedido
 */
interface RelacaoClientePedido {
  idCliente: number | null;
  idPedido: number | null;
}

/**
 * Interface para o retorno do backend (seus dados relacionados)
 */
interface DadosRelacionados {
  clientes: any[];
  pedidos: any[];
  relacoes: { clienteId: number, pedidoId: number }[];
}

// Constante de Dados (Extraído para melhor legibilidade)
const TIPOS_CONTA_MOCK = [
  { label: 'Bradesco - Corrente', value: 'CORRENTE_BRADESCO', dadosBanco: null },
  { label: 'Bradesco - PRIME - Corrente', value: 'CORRENTE_BRADESCO_PRIME', 
    dadosBanco: {
        banco: { id: 7 },
        conta: { id: 1 }
      }
  },
  {
    label: 'Nubank - Corrente',
    value: 'CORRENTE_NUBANK',
    dadosBanco: {
        banco: { id: 8 },
        conta: { id: 1 }
      }
    
  },
  { label: 'Nubank - Cartão Crédito', value: 'CARTAO_NUBANK', dadosBanco: null },
  { label: 'Tesouro - PRE', value: 'TESOURO_23', dadosBanco: null },
  { label: 'Tesouro - SELIC', value: 'TESOURO_24', dadosBanco: null },
  { label: 'Tesouro - ICPA', value: 'TESOURO_25', dadosBanco: null }
];

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.scss'],
  providers: [MessageService, MensagemAvisoService],
})
export class ImportarComponent implements OnInit {
  // --- 1. CONFIGURAÇÃO E ESTADO INICIAL ---
  readonly titulo = 'Importar';
  private _filtroInicializado = false; // Flag para evitar chamadas desnecessárias
  
  // --- 2. DADOS (DATA) ---
  clientes: any[] = [];
  pedidos: any[] = [];
  migracoes: any[] = [];
  
  relacoes: RelacaoClientePedido[] = [];
  tipoMovimentacoes: ITipoMovimentacao[] = [];
  listarBancosParaTransferencia: ITransferencia[] = [];
   listarInvestimentos: IInvestimento[] = [];
   transferenciaSeleciado :BancoConta;
   tipoInvestimento : IInvestimento;

  
  // Tipos de conta (inicializado com o mock, mas será sobrescrito pelo serviço)
  tiposConta = TIPOS_CONTA_MOCK; 

  // --- 3. FILTROS E FORMULÁRIOS ---
  filtro!: IImportacao; // Inicializado no ngOnInit
  reg!: IImportacaoRegistro; // Inicializado no ngOnInit e usado no modal
  form: FormGroup;

  // --- 4. ESTADO DA UI (UI STATE) ---
  mostrarModalCliente = false;
  idsClientesEmDestaque: Set<number> = new Set();
  idsPedidosEmDestaque: Set<number> = new Set();

  constructor(
    private router: Router,
    private importaService: ImportaService,
    private tipoMovimentacaoService: TipoMovimentacaoService,
    private transferenciaService: TransferenciaService,
    private fb: FormBuilder,
    private mensagemAviso: MensagemAvisoService,
    private investimentoService: InvestimentoService,
    private messageService: MessageService // PrimeNG
  ) {
    this.form = this.fb.group({ lista: this.fb.array([]) });
  }

  // --- 5. LIFECYCLE HOOKS ---

  ngOnInit(): void {
    this.inicializarFiltro();
    this.carregarDadosIniciais();
  }

  // --- 6. MÉTODOS DE INICIALIZAÇÃO E CARREGAMENTO DE DADOS ---

  private inicializarFiltro(): void {
    const hoje = new Date();
    this.filtro = {
      nrMes: hoje.getMonth() + 1,
      nrAno: hoje.getFullYear(),
      bancoConta: 'CARTAO_NUBANK',
    } as IImportacao;

    this.reg = { filtro: this.filtro } as IImportacaoRegistro;
  }

  /** Carrega tipos de movimentação, bancos e dados iniciais */
  private carregarDadosIniciais(): void {
    this.carregarTiposEContas();
    this.carregarDadosRelacionados();
  }

  /** Carrega Tipos de Movimentação e Bancos Disponíveis */
  private carregarTiposEContas(): void {
    // 1. Tipos de Movimentação
    this.tipoMovimentacaoService.listaTipoMovimentacaoTodos().subscribe({
      next: suc => this.tipoMovimentacoes = suc,
      error: err => this.mensagemAviso.exibirMensagemErro(`Erro ao carregar Tipos de Movimentação: ${err.message}`)
    });

    // 2. Bancos Disponíveis
    this.importaService.listarBancosDisponivel().subscribe({
      next: suc => this.tiposConta = suc,
      error: err => this.mensagemAviso.exibirMensagemErro(`Erro ao carregar Bancos: ${err.message}`)
    });
  }


  getDadosBancoByValue(value: string): any | null {
  // 1. Encontra o objeto no array cujo 'value' corresponde ao parâmetro
  const tipoConta = TIPOS_CONTA_MOCK.find(item => item.value === value);

  // 2. Verifica se um objeto foi encontrado
  if (tipoConta) {
    // 3. Retorna o 'dadosBanco' do objeto encontrado (pode ser um objeto ou null)
    return tipoConta.dadosBanco;
  }

  // 4. Se nenhum objeto foi encontrado, retorna null
  return null;
}

  /** Carrega dados do backend de acordo com filtros (migrações, bancos para transferência e relações) */
  carregarDadosRelacionados(): void {
    // 1. Migrações Realizadas
    this.importaService.listarMigracaoRealizada(this.filtro.nrAno).subscribe({
      next: suc => {
        this.migracoes = suc.data;
        this.atualizarDestaques();
      },
      error: (err) => this.mensagemAviso.exibirMensagemErroString(err)
    });

    // 2. Bancos para Transferência
    this.carregarBancosParaTransferencia(this.getDadosBancoByValue(this.filtro.bancoConta));

    // 3. Clientes, Pedidos e Relações
    if (!this.filtro?.bancoConta) return;
    
    this.importaService.getDadosRelacionado(this.filtro.bancoConta, this.filtro.nrMes, this.filtro.nrAno)
      .subscribe({
        next: (data: DadosRelacionados) => {
          this.clientes = data.clientes || [];
          this.pedidos = data.pedidos || [];
          
          this.relacoes = (data.relacoes || [])
            .map(({ clienteId, pedidoId }) => ({ idCliente: clienteId, idPedido: pedidoId }));
          
          this.atualizarDestaques();
          this._filtroInicializado = true;
        },
        error: (err) => {
          this.mensagemAviso.exibirMensagemErro(`Erro ao carregar dados relacionados: ${err.message}`);
        }
      });
  }

  onSelecionarTransferencia(): void {
    const transferenciaSelecionada = this.transferenciaSeleciado;
    
    const bancoId = this.transferenciaSeleciado.banco.id;
    const contaId = transferenciaSelecionada.conta.id;
    
      this.investimentoService.listarInvestimentoPorBancoConta(bancoId, contaId).subscribe(
        data => {
          this.listarInvestimentos = data.map(tipoInvestimento => ({
            ...tipoInvestimento,
            valor: tipoInvestimento, // Mantém o objeto completo no valor
            id:tipoInvestimento.id,
            label: `(${tipoInvestimento.id}) - ${tipoInvestimento.dsInvestimento}`
          }));
        },
        err => this.mensagemAviso.exibirMensagemErro(err)
      );
    
  }

  carregarBancosParaTransferencia(bancoContaOrigem: any): void {
    this.transferenciaService.listarTransferenciaPorBancoConta(bancoContaOrigem).subscribe(
      data => {
        this.listarBancosParaTransferencia = data.map(transferirPara => ({
          ...transferirPara,
          label: `${transferirPara.transferirPara.banco.dsBanco} - ${transferirPara.transferirPara.conta?.dsConta}`
        }));
      },
      err => this.mensagemAviso.exibirMensagemErro(err)
    );

  }

  // --- 7. MÉTODOS DE CONTROLE DA TABELA RELAÇÃO (CLIENTE X PEDIDO) ---

  /** Adiciona uma nova linha vazia na tabela de relações. */
  adicionarRelacao(): void {
    this.relacoes.push({ idCliente: null, idPedido: null });
    this.atualizarDestaques();
    this.messageService.add({severity:'info', summary:'Relação Adicionada', detail:'Nova linha adicionada para mapeamento.'});
  }

  adicionarRelacaoComValores(cliente: number, pedido : number): void {
    this.relacoes.push({ idCliente: cliente, idPedido: pedido });
    this.atualizarDestaques();    
  }

  /** Remove uma linha da tabela de relações. */
  removerRelacao(index: number): void {
    this.relacoes.splice(index, 1);
    this.atualizarDestaques();
    this.messageService.add({severity:'warn', summary:'Relação Removida', detail:'Linha de mapeamento removida.'});
  }

  /** Chamado quando um ID em uma relação é alterado. Dispara a lógica de destaque. */
  onIdChange(): void {
    this.atualizarDestaques();
  }

  /** Reconstroi os conjuntos de IDs de destaque. */
  atualizarDestaques(): void {
    this.idsClientesEmDestaque.clear();
    this.idsPedidosEmDestaque.clear();

    this.relacoes.forEach(relacao => {
      const idClienteNum = Number(relacao.idCliente);
      const idPedidoNum = Number(relacao.idPedido);

      // Verifica o Cliente
      if (this.clientes.some(c => c.id === idClienteNum)) {
          this.idsClientesEmDestaque.add(idClienteNum);
      }

      // Verifica o Pedido
      if (idPedidoNum && this.pedidos.some(p => p.id === idPedidoNum)) {
          this.idsPedidosEmDestaque.add(idPedidoNum);
      }
    });
  }

  // --- 8. MÉTODOS DE ESTILO (ngClass) ---

  /** Define a classe CSS para destaque na tabela Clientes. */
  getRowClassCliente(idCliente: number): string {
    return this.idsClientesEmDestaque.has(idCliente) ? 'destaque-cliente' : '';
  }

  /** Define a classe CSS para destaque na tabela Pedidos. */
  getRowClassPedido(idPedido: number): string {
    return this.idsPedidosEmDestaque.has(idPedido) ? 'destaque-pedido' : '';
  }

  // --- 9. MÉTODOS DE AÇÃO (FILE HANDLING) ---

  /** Seleciona CSV/XLSX */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const extensao = file.name.split('.').pop()?.toLowerCase();
    
    if (extensao === 'csv') {
        this.readCsvHeaderAndIdentify(file);
    } else if (extensao === 'xls' || extensao === 'xlsx') {
        this.handleXlsxFile(file); 
    } else {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Formato de arquivo não suportado. Use CSV, XLS ou XLSX.'});
    }
  }

  /** Lê apenas a primeira linha do CSV e a envia para o backend para identificação. */
  private readCsvHeaderAndIdentify(file: File): void {
    const reader = new FileReader();
    
    reader.onload = () => {
        const conteudo = (reader.result as string).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const primeiraLinha = conteudo.split('\n')[0];
        
        if (!primeiraLinha) {
            this.messageService.add({severity:'error', summary:'Erro', detail:'Arquivo CSV vazio.'});
            return;
        }

        // 1. CHAMA O ENDPOINT NO JAVA PARA IDENTIFICAR O BANCO
        this.importaService.identificarBanco(primeiraLinha).subscribe({
            next: (data) => {
                this.messageService.add({severity:'success', summary:'Banco Identificado', detail:`Banco identificado: ${data.bancoConta} (Código: ${data.codigo}).`});
                
                // 2. ATUALIZA O FILTRO E CARREGA O CONTEÚDO COMPLETO
                this.filtro = { 
                    ...this.filtro, 
                    nomeArquivo: file.name, 
                    arquivoCsv: conteudo, 
                    tabelaCsv: conteudo.split('\n').filter(l => l.trim().length > 0).map(l => l.split(';')),
                    bancoConta: data.bancoConta // Define o tipo de conta identificado
                };
            },
            error: (err) => {
                this.mensagemAviso.exibirMensagemErro(`Erro ao identificar o banco: ${err.message}`);
                // Caso falhe, ainda carrega o arquivo, mas o usuário deve selecionar o banco manualmente
                this.filtro = { ...this.filtro, nomeArquivo: file.name, arquivoCsv: conteudo };
            }
        });
    };

    reader.readAsText(file, 'UTF-8');
  }
  
  /** Lida com o carregamento de arquivos XLSX. */
  private handleXlsxFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]; 
      
      this.filtro = { ...this.filtro, nomeArquivo: file.name, arquivoCsv: jsonData, tabelaCsv: jsonData as string[][] };
      this.messageService.add({severity:'success', summary:'Arquivo Carregado', detail:`Arquivo '${file.name}' pronto para importação.`});
    };
    reader.readAsArrayBuffer(file);
  }

  /** Importa CSV/XLS */
  importarDados(): void {
    if (!this.filtro?.nomeArquivo) {
      this.messageService.add({severity:'warn', summary:'Atenção', detail:'Nenhum arquivo selecionado!'});
      return;
    }
    if (!this.filtro?.bancoConta) {
      this.messageService.add({severity:'warn', summary:'Atenção', detail:'Selecione o Tipo (Banco/Conta) antes de importar!'});
      return;
    }

    this.importaService.enviarDadosArquivo(this.filtro).subscribe({
      next: () => this.mensagemAviso.exibirMensagemSucesso("Importação concluída!"),
      error: (err) => this.mensagemAviso.exibirMensagemErro(err)
    });
  }

  // --- 10. MÉTODOS DE MODAL E SALVAMENTO ---

  /** Abre modal de pedido */
  abrirModalCliente(pedido: any): void {
    this.reg = { ...this.reg,
      dsObservacao: pedido.descricao || pedido.nome,
      id: pedido.id,
      idTipoMovimentacao : '0',
      nrDia: pedido.dataMovimentacao,
      vlCredito: pedido.valor,
    };
    this.mostrarModalCliente = true;
  }

  /** Salva pedido */
  salvarPedido(): void {

    this.reg.transferenciaSelecionada = this.transferenciaSeleciado;
    this.reg.tipoInvestimento= this.tipoInvestimento;

    this.importaService.adicionarRegistro(this.reg).subscribe({
      next: (idMovimentacao) => {
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Registro adicionado com sucesso!'});
        this.mostrarModalCliente = false;
        this.adicionarRelacaoComValores(Number(idMovimentacao), this.reg.id);
        this.salvarRelacoes();
        this.carregarDadosRelacionados();
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Erro', detail:`Falha ao salvar registro: ${err.message}`});
      }
    });
  }

  /** Remove todas conexões */
  removerConexoes(): void {
    this.relacoes = [];
    this.atualizarDestaques();
    this.messageService.add({severity:'success', summary:'Limpo', detail:'Todas as relações foram removidas.'});
  }

  /** Salva relações */
  salvarRelacoes(): void {
    // Prepara os dados no formato esperado pela API
    const relacoesParaSalvar = this.relacoes
      .filter(rel => rel.idCliente && rel.idPedido) // Garante que só envia relações válidas
      .map(rel => ({
        clienteId: rel.idCliente,
        pedidoId: rel.idPedido,
        icTipo: this.filtro?.bancoConta ?? null,
        nrMes: this.filtro.nrMes,
        nrAno: this.filtro.nrAno,
      }));

    if (relacoesParaSalvar.length === 0) {
      this.messageService.add({severity:'warn', summary:'Atenção', detail:'Nenhuma relação válida para salvar.'});
      return;
    }

    this.importaService.salvarRegistro(relacoesParaSalvar).subscribe({
      next: () => this.mensagemAviso.exibirMensagemSucesso('Relações salvas com sucesso!'),
      error: (err) => this.mensagemAviso.exibirMensagemErro('Erro ao salvar relações: ' + err.message)
    });
  }
}