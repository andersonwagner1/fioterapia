import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ICompetencia } from 'src/app/conta/model/i-competencia';
import { CompetenciaService } from 'src/app/conta/service/competencia.service';

@Component({
  selector: 'app-selecionar-data',
  standalone: true,
  imports: [SelectButtonModule, InputGroupModule, FormsModule],
  templateUrl: './selecionar-data.component.html',
  styleUrl: './selecionar-data.component.scss'
})
export class SelecionarDataComponent implements OnInit {


  @Input() dataSelecionada!: ICompetencia; // Expor a data para ser acessada
  @Output() evtDataSelecionada = new EventEmitter<ICompetencia>();


listarMeses : number[] = [1,2,3,4,5,6,7,8,9,10,11,12];

constructor(private competenciaService : CompetenciaService
  
){

}


onSelecionadoMesAno() {
  this.competenciaService.get(this.dataSelecionada.nrMes, this.dataSelecionada.nrAno).subscribe(
    dada =>  this.evtDataSelecionada.emit({ ...dada}),
    err => console.log(err)
  )
}


  ngOnInit(): void {
    this.competenciaService.get(this.dataSelecionada.nrMes, this.dataSelecionada.nrAno).subscribe(
      dada =>  this.evtDataSelecionada.emit({ ...dada}),
      err => console.log(err)
    )
  
  }

}
