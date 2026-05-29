
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MensagemAvisoService {


    constructor(private messageService: MessageService) {}

    exibirMensagemErro(err){
        console.log(err);
        this.messageService.add({
            severity: 'error',
            summary:"Erro",
            detail: err.message,
            life: 6000,
        })
    }


        exibirMensagemErroString(err: string){
        console.log(err);
        this.messageService.add({
            severity: 'error',
            summary:"Erro",
            detail: err,
            life: 6000,
        })
    }

  exibirMensagemSucesso(detail: string = 'Envio de registro') {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: detail,
      life: 3000,
    });
  }
  }
