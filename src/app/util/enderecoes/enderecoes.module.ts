import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class EnderecoesModule {

protected readonly ENDERECO = `${environment.API}`;

    // IMPORTACAO
    protected readonly IDENTIFICAR_BANCO_URL = `${environment.API}/migrar/identificar`;
    protected readonly ENVIAR_ARQUIVO_IMPORTACAO = `${environment.API}/migrar/importar`;
    protected readonly MOSTRARA_DADOS_IMPORTACAO = `${environment.API}/migrar/mostrar`;
    protected readonly SALVAR_DADOS_IMPORTACAO = `${environment.API}/migrar/relacao`;
    protected readonly LISTAR_BANCOS_DISPONIVEL_IMPORTACAO = `${environment.API}/migrar/listar-bancos`;
    protected readonly SALVAR_REGISTRO_MOVIMENTACAO = `${environment.API}/migrar/salvar-registro`;
    protected readonly LISTAR_MIRACAO_REALIZADA = `${environment.API}/migrar/extracao-realizada`;

    //Banco conta
    protected readonly BANCO_CONTA_LISTA_APENAS_INVESTIMENTO_ATIVO = `${environment.API}/banco-conta/listar-banco-investimento`;
    protected readonly BANCO_CONTA_LISTAR_POR_BANCO = `${environment.API}/banco-conta/listar-por-banco`;
    protected readonly BANCO_CONTA_FILTRAR = `${environment.API}/banco-conta/filtrar`;
    protected readonly BANCO_CONTA_SEM_VINCULSO = `${environment.API}/banco-conta/listar-bancos-disponives`;
    protected readonly BANCO_CONTA_CONSULTAR_POR_BANCO_CONTA = `${environment.API}/banco-conta/consultar-banco-conta/`;
    protected readonly BANCO_CONTA_LISTAR_CARTAO_CREDITO_POR_COMPETENCIA = `${environment.API}/banco-conta/listar/cartao-credito`; 

    //banco
    protected readonly  BANCO_CONTA_LISTAR_POR_COMPETENCIA = `${environment.API}/banco-conta/listar-banco-por-competencia`;
   // protected readonly BANCO_CONTA_FILTRAR = `${environment.API}/banco-conta/filtrar`;

  //cartão de credito
  protected readonly  CARTAO_CREDITO_LISTAR_POR_COMPETENCIA = `${environment.API}/cartao-credito/listar/movimentacoes`;
  
    //conta
    protected readonly CONTA_LISTAR_POR_CONTA = `${environment.API}/banco-conta/listar-por-banco`;
   // protected readonly BANCO_CONTA_FILTRAR = `${environment.API}/banco-conta/filtrar`;

    //Movimentacao
    protected readonly MOVIMENTACAO_LISTAR_COMPETENCIA_BANCO_CONTA = `${environment.API}/movimentacao/listar-por-banco-conta-competencia`;
    protected readonly MOVIMENTACAO_SALVAR = `${environment.API}/movimentacao/salvarMovimentacao`;
    protected readonly MOVIMENTACAO_ALTERAR_COMPETENCIA_BANCO = `${environment.API}/movimentacao/alterarCompetenciaBanco`;
    protected readonly MOVIMENTACAO_SALVAR_SALDO = `${environment.API}/movimentacao/salvarSaldo`;
    protected readonly MOVIMENTACAO_DETALHE_RELATORIO = `${environment.API}/movimentacao/consultar-detalhe-relatorio`;
    //  protected readonly BANCO_CONTA_FILTRAR = `${environment.API}/banco-conta/filtrar`;

    //tipoMovimentacao
    protected readonly TIPO_MOVIMENTACAO_LISTAR_POR_NOME = `${environment.API}/tipo-movimentacao/listar-por-nome-ativo`;
    protected readonly TIPO_MOVIMENTACAO_LISTA_TODO_RELATORIO = `${environment.API}/tipo-movimentacao/lista/tipo-relatorio`;
    protected readonly TIPO_MOVIMENTACAO_LISTA_TODO_TIPO_MOVIMENTACAO = `${environment.API}/tipo-movimentacao/lista/tipo-movimentacao`;
    protected readonly TIPO_MOVIMENTACAO_LISTA_DEBITOS_ATIVOS = `${environment.API}/tipo-movimentacao/lista-debito-valido`;
    protected readonly TIPO_MOVIMENTACAO_LISTA_TODOS= `${environment.API}/tipo-movimentacao/listar-todos`;
    
   // protected readonly BANCO_CONTA_FILTRAR = `${environment.API}/banco-conta/filtrar`;

    //movimentacao final
    protected readonly MOVIMENTACAO_FINAL_CONSULTAR_POR_BANCO_COMPETENCIA = `${environment.API}/movimentacao-final/consultar-final/`;
    protected readonly MOVIMENTACAO_CALCULAR = `${environment.API}/movimentacao-final/atualizar-calculo/`;
    protected readonly MOVIMENTACAO_FINAL_QUANTIDADE_REGISTRO = `${environment.API}/movimentacao-final/registro-movimentacao/`;
    //  protected readonly BANCO_CONTA_FILTRAR = `${environment.API}/banco-conta/filtrar`;

    //transferncia
    protected readonly TRANSFERENCIA_LISTAR_POR_BANCO_CONTA = `${environment.API}/transferencia/listar-por-banco`
    protected readonly TRANSFERENCIA_ID = `${environment.API}/transferencia/consultar`

    //investimento
    protected readonly INVESTIMENTO_POR_BANCO_CONTA = `${environment.API}/investimento/listar-por-banco`;

    //relatorio
    protected readonly RELATORIO_MOSTRAR_FINAL = `${environment.API}/relatorio/mostrar-final`;
    protected readonly RELATORIO_SANKEY = `${environment.API}/relatorio/grafico/sankey`;


    //rotected readonly RELATORIO_SALDO = `${environment.API}/relatorio/painel/mostrar-saldo-final`;
    protected readonly RELATORIO_MOVIMENTACAO_FINANCEIRA = `${environment.API}/relatorio/painel/movimentacao-financeira`;
    
    protected readonly RELATORIO_INCOSISTENCIA = `${environment.API}/relatorio/inconsistencia`;
    protected readonly PROVISORIO = `${environment.API}/relatorio/migrar`;
    protected readonly GRAFICO_CREDITO_DEBITO = `${environment.API}/relatorio/painel/grafico-movimentacao`;
    protected readonly GRAFICO_CREDITO = `${environment.API}/relatorio/painel/grafico-credito`;
    protected readonly TABELA_BANCO_FINAL = `${environment.API}/relatorio/painel/tabela/tabela-banco-final`;
    protected readonly TABELA_BANCO_FINAL_REAL = `${environment.API}/relatorio/painel/tabela/tabela-banco-final-real`;
    protected readonly GRAFICO_CRECIMENTO= `${environment.API}/relatorio/painel/crescimento`
    
   
  //cOPMETENCIA
  protected readonly COMPETENCIA_CONSULTA_MES_ANO =  `${environment.API}/competencia/get`;




    public readonly BANCO_LISTAR_TODOS = `${environment.API}/banco/listar/{nome}`
    public  readonly BANCO_POR_ID =  `${environment.API}/banco/:id`;

    protected  readonly BANCO_EXCLUIR = `${environment.API}/banco/atualizar`;
    //`${environment.API}/banco/lista-por-competencia/:ano/:mes`;







    protected readonly APLICACAO_LISTAR_DISPONIVEIS_POR_BANCO = "assets/demo/data/aplicacao.json";


}
