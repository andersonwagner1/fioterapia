import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { UtilBasicoModule } from 'src/app/util/util-basico/util-basico.module';
import { ICompetencia } from '../../model/i-competencia';
import { CompetenciaService } from '../../service/competencia.service';



@Component({
  selector: 'app-Competencia',
  templateUrl: './competencia.component.html',
  styleUrl: './competencia.component.scss',
  providers: [MessageService, MensagemAvisoService]
})
export class CompetenciaComponent extends UtilBasicoModule<ICompetencia> implements OnInit {

    protected cols: any[] = [];  // Colunas da tabela
    protected situacao: { label: string; value: string; }[] = []; // Inicializado o array para evitar erros
  
    // Título da página
    titulo: string = "Competência";
  
    /**
     * Construtor da classe CompetenciaComponent
     * 
     * @param competenciaService Serviço responsável pela manipulação de competências
     * @param mensagemAviso Serviço responsável por exibir avisos
     */
    constructor(
      competenciaService: CompetenciaService,
      mensagemAviso: MensagemAvisoService
    ) {
      super(competenciaService, mensagemAviso);
    }
  
    /**
     * Método de inicialização do componente
     * Carrega a lista de competências ao iniciar
     */
    ngOnInit(): void {
      this.carregarLista();
    }
  
    /**
     * Retorna o rótulo correspondente ao valor recebido no select box
     * 
     * @param value Valor recebido do select box
     * @returns O rótulo correspondente ou 'SIM' como valor padrão
     */
    getLabelByValue(value: string): string {
      const selectedOption = this.situacao.find(option => option.value === value);
      return selectedOption ? selectedOption.label : 'SIM';
    }

}
