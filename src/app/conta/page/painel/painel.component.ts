import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api'; // Mantido, pois estava no original
import { Chart, registerables } from 'chart.js';
import { SankeyController, Flow } from 'chartjs-chart-sankey';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { RelatorioService} from '../../service/relatorioService';
import { MovimentacaoService } from '../../service/movimentacao.service';
import { IMovimentacao } from '../../model/i-movimentacao';
import { ICompetencia } from '../../model/i-competencia';

Chart.register(...registerables, SankeyController, Flow);

@Component({
    templateUrl: './painel.component.html',
})
export class PainelComponent implements OnInit, OnDestroy { // Implementando OnDestroy

    chartData: any;
    chartOptions: any;
    chartData2: any;
    chartOptions2: any;

    // Propriedades removidas: teste, listaAnos, items, products (Não utilizadas)
    detalheRelatorio: boolean = false;
    // movimentacaoFinais: any[]; // Removida, pois a tabela usa tabelaMovimentacaoFinal

    competenciaSelecionado!: ICompetencia; // Usando '!' para inicialização no ngOnInit
    
    saldo: any[] = []; // Inicializado como array vazio para consistência

    // items!: MenuItem[]; // Removida

    // products!: any[]; // Removida

    chartCreditos: any; // Tipagem ajustada
    chartDataCrescimento: any; // Tipagem ajustada

    chartOptionsStrack: any;
   
    subscription!: Subscription;
    tabelaBancoFinal: any[] = [];
    tabelaBancoFinalReal: any[] = [];
    tabelaMovimentacaoFinal: any[] = [];
    relatorioDetalhe: IMovimentacao[] = [];

    listaIncosistencia: any[] = [];

    constructor(public layoutService: LayoutService, private relatorioService: RelatorioService, private movimentaocaoService: MovimentacaoService) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
            this.initChart();
        });
    }

    ngOnInit() {
        // Inicializa a competência com o ano atual e o mês atual (corrigido para 1-12)
        const dataAtual = new Date();
        this.competenciaSelecionado = {
            nrAno: dataAtual.getFullYear(),
            nrMes: dataAtual.getMonth() + 1, // Mês é 0-indexado, adicionando 1
        };

        this.initChart();

        // this.items = [ // Removido por não ser utilizado
        //     { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        //     { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        // ];

       // this.mostrarRelatorioFinal(); // Comentário mantido
        this.mostrarIncosistencia();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onDetalheMovimentacao(icRelatorio: string, mes: number) {
        this.detalheRelatorio = true;
        this.movimentaocaoService.listarDetalheMovimentacaoRelatorio(icRelatorio, mes, this.competenciaSelecionado.nrAno).subscribe(
            data => this.relatorioDetalhe = data,
            err => console.error('Erro ao listar detalhes da movimentação:', err) // Tratamento de erro padronizado
        );
    }

    private valorAnterior: number = 0;
    getComparar(valorAtual: number): string[] {
        if (this.valorAnterior < valorAtual) {
            this.valorAnterior = valorAtual;            
            return ["pi-angle-double-up", "blue"];
        } else {
            this.valorAnterior = valorAtual;
            return ["pi-angle-double-down", "red"];
        }
    }

    mostrarIncosistencia(): void {
        this.relatorioService.listarIncosistencia().subscribe(
            data => {
                this.listaIncosistencia = data
            },
            err => console.error('Erro ao listar inconsistências:', err) // Tratamento de erro padronizado
        )

        // Chamada duplicada removida: this.relatorioService.listarPainelValores(this.competenciaSelecionado.nrAno).subscribe(...)
        
        this.relatorioService.listarPainelValores(this.competenciaSelecionado.nrAno).subscribe(
            data => {
                // console.log(this.saldo); // console.log removido
                this.saldo = data;
            },
            err => console.error('Erro ao listar painel de valores:', err) // Tratamento de erro padronizado
        )

        this.relatorioService.listarPainelMovimentacaoFinal(this.competenciaSelecionado.nrAno).subscribe(
            data => {
                this.tabelaMovimentacaoFinal = data;
            },
            err => console.error('Erro ao listar movimentação final:', err) // Tratamento de erro padronizado
        )

        this.relatorioService.graficoCredtioDebito(this.competenciaSelecionado.nrAno).subscribe(
            data => {
                this.chartCreditos = data;
            },
            err => console.error('Erro ao carregar gráfico de crédito/débito:', err) // Tratamento de erro padronizado
        )

        this.relatorioService.graficoRelatorioCredito(this.competenciaSelecionado.nrAno).subscribe(
            data => {
                this.chartData = data;
            },
            err => console.error('Erro ao carregar gráfico de relatório de crédito:', err) // Tratamento de erro padronizado
        )

        this.relatorioService.graficoCrescimento(this.competenciaSelecionado.nrAno).subscribe(
            data => {
                this.chartDataCrescimento = data;
            },
            err => console.error('Erro ao carregar gráfico de crescimento:', err) // Tratamento de erro padronizado
        )

        this.relatorioService.tabelaRelatorioBancoFinalReal(this.competenciaSelecionado.nrAno).subscribe(
            data => {
                this.tabelaBancoFinalReal = data;
                // console.log(this.tabelaBancoFinal); // console.log removido
            },
            err => console.error('Erro ao carregar tabela de saldo final real:', err) // Tratamento de erro padronizado
        )

        this.relatorioService.tabelaRelatorioBancoFinal(this.competenciaSelecionado.nrAno).subscribe(
            data => {
                this.tabelaBancoFinal = data;
            },
            err => console.error('Erro ao carregar tabela de saldo final:', err) // Tratamento de erro padronizado
        )

        // Chamada para atualizar o Gráfico Sankey
        this.iniciarGrafico();
    }

    // Código Sankey (iniciarGrafico) mantido intacto
    iniciarGrafico(){
       
       this.relatorioService.listarGraficoSankey(this.competenciaSelecionado).subscribe(
            suc => {
                this.chartData2 = {
      datasets: [
        {
          label: 'Movimentação do Dinheiro',
          data: suc, // seus dados no formato Sankey
          colorFrom: 'rgba(0, 123, 255, 0.8)',   // azul vibrante
          colorTo: 'rgba(0, 200, 100, 0.8)',     // verde mais claro
          colorMode: 'gradient',
          borderWidth: 2,
        },
      ],
    };
    
    this.chartOptions2 = {
      sankey: {
        node: {
          width: 40,         // largura de cada nó
          padding: 25,       // espaço vertical entre nós
          label: {
            font: {
              size: 16,      // tamanho da fonte dos rótulos
              weight: 'bold'
            },
            color: '#111'    // cor dos textos nos nós
          }
        },
        link: {
          colorMode: 'gradient',
          borderColor: '#ccc',
          borderWidth: 1,
          transparency: 0.4  // deixa os fluxos semi-transparentes
        }
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 16
            },
            color: '#333'
          }
        },
        tooltip: {
          bodyFont: {
            size: 14
          }
        }
      },
      layout: {
        padding: 40
      }
    };
            },
            err => console.log("erro")
        );
    
        /*
        this.chartData2 = {
          datasets: [
            {
              label: 'Movimentação do Dinheiro',
              data: [
                { from: 'Credito', to: 'Corrente', flow: 100 },
                { from: 'Salario', to: 'Corrente', flow: 100 },
                { from: 'Adiantamento', to: 'Corrente', flow: 50 },
                { from: 'Resgate', to: 'Corrente', flow: 50 },
                { from: 'Corrente', to: 'aplicação', flow: 100 },
                { from: 'Corrente', to: 'Cartão de credito', flow: 100 },
                { from: 'Corrente', to: 'Outros', flow: 100 },
                
              ],
              colorFrom: 'blue',
              colorTo: 'red',
              colorMode: 'gradient',
            },
          ],
        };*/
    
    this.chartOptions2 = {
      plugins: {
        title: {
          display: true,
          text: 'UK Power Generation (2023)',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              // Mostra o fluxo com label
              const d = context.raw as any;
              return `${d.from} → ${d.to}: ${d.flow} GWh`;
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
      
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // console.log("estou vendo a char", documentStyle.getPropertyValue('--bluegray-700')); // console.log removido
        this.iniciarGrafico();
        
        // Dados estáticos removidos, pois chartData é populado pela API
        // this.chartData = { ... };

        // Inicialização de chartOptions (opções para gráficos de linha/barra não empilhados)
        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        this.chartOptionsStrack = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    // Método vazio removido: pesquisarMovimentacaoFinal()
}