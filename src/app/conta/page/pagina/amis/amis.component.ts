import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface AmisItem { titulo: string; criterios: string[]; marcado?: boolean; }
interface Subescala { chave: string; nome: string; cor: string; icone: string; aberta: boolean; itens: AmisItem[]; }
interface Paciente { nome: string; registro: string; avaliador: string; local: string; dataNasc: string; dataAval: string; semGestacao: number | null; usarCorrigida: boolean; }
interface PontoEvolucao { idadeMeses: number; pontuacao: number; }

@Component({ selector: 'app-amis', templateUrl: './amis.component.html', styleUrls: ['./amis.component.scss'] })
export class AmisComponent implements OnInit, AfterViewInit {
  @ViewChild('grafico') grafico?: ElementRef<HTMLCanvasElement>;
  graficoParaImpressao = '';
  readonly storageKey = 'amis_interativa_v1';
  paciente: Paciente = this.novoPaciente();
  observacoes = '';
  readonly historicoExemplo: PontoEvolucao[] = [
    { idadeMeses: 1, pontuacao: 4 },
    { idadeMeses: 2, pontuacao: 7 },
    { idadeMeses: 3, pontuacao: 10 },
    { idadeMeses: 4, pontuacao: 14 },
    { idadeMeses: 5, pontuacao: 18 }
  ];
  subescalas: Subescala[] = [
    { chave: 'prona', nome: 'Prona', cor: '#2563eb', icone: 'pi pi-arrow-down', aberta: true, itens: this.itens([
      ['Deitada em posição prona (1)', 'Flexão fisiológica|Vira a cabeça para tirar o nariz da superfície'],
      ['Deitada em posição prona (2)', 'Levanta a cabeça assimetricamente a 45°|Não consegue manter a cabeça na linha média'],
      ['Apoio em posição prona', 'Cotovelos para trás em relação aos ombros|Levanta a cabeça sem apoio a 45°'],
      ['Apoio em antebraço (1)', 'Levanta e mantém a cabeça a mais de 45°|Cotovelos alinhados com os ombros|Peito elevado'],
      ['Mobilidade em posição prona', 'Cabeça a 90°|Transferência de peso sem controle'],
      ['Apoio em antebraço (2)', 'Cotovelos à frente dos ombros|Retração ativa do queixo com alongamento do pescoço'],
      ['Apoio em braço estendido', 'Braços estendidos|Retração de queixo e peito elevado|Transferência de peso lateral'],
      ['Alcance com apoio em antebraço', 'Transferência ativa de peso para um lado|Alcance controlado com o braço livre'],
      ['Pivoteio', 'Pivoteia|Movimentos em braços e pernas|Flexão lateral de tronco'],
      ['Fica de joelhos sobre quatro pontos', 'Pernas flexionadas e abduzidas em rotação externa|Lordose lombar|Mantém a posição'],
      ['Rolar da posição prona para supina sem rotação', 'Movimento iniciado pela cabeça|O tronco se move como uma unidade'],
      ['Posição de nado', 'Padrão extensor ativo'],
      ['Rolar da posição prona para supina com rotação', 'Rotação de tronco'],
      ['Apoiado em decúbito lateral', 'Dissociação de pernas|Estabilidade de ombros|Rotação no eixo do corpo'],
      ['Ajoelhar-se sobre 4 pontos para sentar-se ou semi-sentar-se', 'Entra e sai dessa posição|Pode conseguir sentar-se'],
      ['Rastejar recíproco', 'Movimentos recíprocos de braços e pernas com rotação de tronco'],
      ['Engatinhar recíproco (1)', 'Abdução de pernas com rotação externa|Lordose lombar|Transferência de peso para os lados com flexão lateral do tronco'],
      ['Alcance a partir de apoio de braço em extensão', 'Alcança com o braço em extensão|Rotação de tronco'],
      ['Fica em joelhos sobre 4 pontos (2)', 'Quadris alinhados sob a pelve|Alinhamento da coluna lombar'],
      ['Engatinhar recíproco (2)', 'Coluna lombar alinhada|Move-se com rotação de tronco'],
      ['Posição de joelhos sobre 4 pontos modificada', 'Brinca nessa posição|Pode mover-se para a frente']
    ])},
    { chave: 'supino', nome: 'Supino', cor: '#7c3aed', icone: 'pi pi-minus', aberta: false, itens: this.itens([
      ['Deitada em posição supina (1)', 'Flexão fisiológica|Rotação da cabeça|Mão na boca|Movimentos aleatórios de braços e pernas'],
      ['Deitada em posição supina (2)', 'Rotação da cabeça para a linha média|RTCA não obrigatório'],
      ['Deitada em posição supina (3)', 'Cabeça na linha média|Movimenta os braços, mas não consegue trazer as mãos para a linha média'],
      ['Supina (4)', 'Flexores do pescoço ativos|Retração do queixo|Leva as mãos à linha média'],
      ['Mãos nos joelhos', 'Retração do queixo|Alcança os joelhos com músculos abdominais ativos'],
      ['Mãos nos pés', 'Pode manter as pernas elevadas|Apresenta mobilidade pélvica'],
      ['Extensão ativa', 'Empurra-se para extensão com as pernas'],
      ['Rolar da posição supina para prona sem rotação', 'Retificação lateral da cabeça|O tronco se move como uma unidade'],
      ['Rolar da posição supina para prona com rotação', 'Rotação de tronco']
    ])},
    { chave: 'sentado', nome: 'Sentado', cor: '#16a34a', icone: 'pi pi-stop', aberta: false, itens: this.itens([
      ['Sentada com apoio', 'Levanta e mantém a cabeça na linha média brevemente'],
      ['Sentada com apoio sobre os braços', 'Mantém a cabeça na linha média|Mantém apoio sobre os braços brevemente'],
      ['Empurra-se para sentar', 'Retração do queixo|Cabeça alinhada ou à frente do corpo'],
      ['Sentada sem sustentação', 'Adução da escápula e extensão do úmero|Não consegue manter a posição'],
      ['Sentada com apoio de braços estendidos', 'Coluna torácica estendida|Movimentos da cabeça independentes do tronco, com apoio sobre os braços estendidos'],
      ['Sentada sem sustentação e sem apoio de braços', 'Não consegue ficar na posição sentada por muito tempo'],
      ['Transferência de peso na posição sentada sem sustentação', 'Transferência de peso para frente, trás e lados|Não pode ser deixada sozinha na posição sentada'],
      ['Sentada sem apoio de braços (1)', 'Os braços se movem longe do corpo|Pode brincar com brinquedo nesta posição|Pode ser deixada sozinha sentada'],
      ['Alcance com rotação na posição sentada', 'Senta-se independentemente|Alcança um brinquedo com rotação do tronco'],
      ['Da posição sentada para a posição prona', 'Desloca-se da posição sentada para a prona|Puxa-se com os braços|Pernas inativas'],
      ['Da posição sentada para joelhos sobre 4 pontos', 'Levanta ativamente a pelve, as nádegas e a perna não usada de apoio|Assume a posição de joelhos sobre 4 pontos'],
      ['Sentada sem apoio de braços (2)', 'Posição das pernas variável|Assume e sai das posições facilmente']
    ])},
    { chave: 'ortostatica', nome: 'Ortostática', cor: '#ea580c', icone: 'pi pi-sort-amount-up', aberta: false, itens: this.itens([
      ['Em pé com apoio (1)', 'Pode apresentar flexão intermitente de quadris e joelhos'],
      ['Em pé com apoio (2)', 'Cabeça alinhada com o corpo|Quadril atrás dos ombros|Movimentos variáveis'],
      ['Em pé com apoio (3)', 'Quadris alinhados com os ombros|Controle ativo de tronco|Movimentos variáveis das pernas'],
      ['Puxar-se para a posição em pé com apoio', 'Empurra-se com os braços e joelhos estendidos'],
      ['Puxar-se para a posição em pé e ficar em pé', 'Empurra-se para a posição em pé|Transfere o peso de um lado para o outro'],
      ['Em pé com apoio e rotação', 'Rotação de tronco e pelve'],
      ['Marcha lateral com apoio sem rotação', 'Anda de um lado para o outro sem rotação'],
      ['Semiajoelhada', 'Pode assumir a posição em pé ou permanecer brincando nesta posição'],
      ['Abaixar-se com controle a partir da posição em pé', 'Abaixa-se com controle a partir da posição em pé'],
      ['Marcha lateral com apoio e rotação', 'Anda de um lado para o outro com rotação'],
      ['Em pé de forma independente', 'Fica em pé sozinha por algum tempo|Reações de equilíbrio nos pés'],
      ['Primeiros passos', 'Anda independentemente|Move-se rapidamente com passos curtos'],
      ['Posição em pé a partir da posição agachada modificada', 'Move-se da posição agachada para em pé, com flexão e extensão adequadas de quadris e joelhos'],
      ['Posição em pé a partir da posição quadrúpede', 'Empurra-se rapidamente com as mãos para alcançar a posição em pé'],
      ['Marcha independente', 'Anda com independência'],
      ['Posição agachada', 'Mantém a posição por meio de reações de equilíbrio dos pés e do tronco']
    ])}
  ];
  readonly meses = Array.from({ length: 19 }, (_, i) => i);
  readonly percentis: Record<number, number[]> = {
    5:[1,2,4,6,9,11,14,17,20,23,30,35,40,40,47,52,57,58,58], 10:[2,4,6,8,11,14,17,20,22,27,33,37,41,45,49,54,57,58,58],
    25:[3,5,8,11,14,17,20,24,30,35,38,40,43,46,50,55,57,58,58], 50:[4,7,10,13,17,21,25,29,38,42,45,47,49,52,55,57,58,58,58],
    75:[5,8,12,16,20,24,29,34,44,48,51,53,56,57,58,58,58,58,58], 90:[6,10,14,18,23,28,33,40,51,56,57,58,58,58,58,58,58,58,58]
  };
  readonly cores: Record<number, string> = {5:'#0284c7',10:'#d97706',25:'#4338ca',50:'#db2777',75:'#15803d',90:'#dc2626'};

  ngOnInit(): void { this.carregar(); }
  ngAfterViewInit(): void { setTimeout(() => this.desenharGrafico()); }
  private itens(valores: string[][]): AmisItem[] { return valores.map(([titulo, criterios]) => ({ titulo, criterios: criterios.split('|'), marcado: false })); }
  private novoPaciente(): Paciente { return { nome:'', registro:'', avaliador:'', local:'', dataNasc:'', dataAval:new Date().toISOString().slice(0, 10), semGestacao:null, usarCorrigida:false }; }
  contar(sub: Subescala): number { return sub.itens.filter(i => i.marcado).length; }
  get subescalasSelecionadas(): Subescala[] { return this.subescalas.filter(sub => this.contar(sub) > 0); }
  itensSelecionados(sub: Subescala): AmisItem[] { return sub.itens.filter(item => item.marcado); }
  formatarData(data: string): string {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
  }
  formatarGestacao(): string { return this.paciente.semGestacao === null ? '—' : `${this.paciente.semGestacao} semanas`; }
  pontuar(sub: Subescala): { previos: number; janela: number; total: number } {
    const marcados = sub.itens.map((item, i) => item.marcado ? i : -1).filter(i => i >= 0);
    if (!marcados.length) return { previos: 0, janela: 0, total: 0 };
    const primeiro = Math.min(...marcados), ultimo = Math.max(...marcados);
    const janela = marcados.filter(i => i >= primeiro && i <= ultimo).length;
    return { previos: primeiro, janela, total: primeiro + janela };
  }
  get total(): number { return this.subescalas.reduce((s, sub) => s + this.pontuar(sub).total, 0); }
  get idadeCronologica(): number | null { return this.calcularIdade(this.paciente.dataNasc, this.paciente.dataAval); }
  get idadeCorrigida(): number | null {
    const cron = this.idadeCronologica, semanas = this.paciente.semGestacao;
    return cron !== null && semanas !== null && semanas < 37 ? Math.max(0, cron - ((40 - semanas) * 7 / 30.4368)) : null;
  }
  get idadeClassificacao(): number | null { return this.paciente.usarCorrigida && this.idadeCorrigida !== null ? this.idadeCorrigida : this.idadeCronologica; }
  formatarIdade(valor: number | null): string { if (valor === null) return '—'; const m = Math.floor(valor); return `${m}m ${Math.round((valor - m) * 30.4368)}d (${valor.toFixed(1)} meses)`; }
  private calcularIdade(nascimento: string, avaliacao: string): number | null { if (!nascimento || !avaliacao) return null; const n = new Date(`${nascimento}T00:00:00`), a = new Date(`${avaliacao}T00:00:00`); const dias = (+a - +n) / 86400000; return Number.isFinite(dias) && dias >= 0 ? dias / 30.4368 : null; }
  get classificacao(): { texto: string; classe: string } {
    const idade = this.idadeClassificacao;
    if (idade === null) return { texto: 'Informe as datas para calcular a classificação', classe: 'neutra' };
    if (idade > 18.5) return { texto: 'Idade fora da faixa normativa (0–18 meses)', classe: 'neutra' };
    const p = this.percentisInterpolados(idade), score = this.total;
    if (score < p[5]) return { texto:'Abaixo do percentil 5 — sinal de alerta para atraso motor', classe:'alerta' };
    if (score < p[10]) return { texto:'Entre percentis 5 e 10 — monitorar de perto', classe:'alerta' };
    if (score < p[25]) return { texto:'Entre percentis 10 e 25 — levemente abaixo do esperado', classe:'atencao' };
    if (score < p[75]) return { texto:'Entre percentis 25 e 75 — desenvolvimento motor típico', classe:'ok' };
    if (score < p[90]) return { texto:'Entre percentis 75 e 90 — acima do esperado', classe:'ok' };
    return { texto:'Igual ou acima do percentil 90 — desenvolvimento avançado', classe:'ok' };
  }
  alternarItem(item: AmisItem): void { item.marcado = !item.marcado; this.atualizar(); }
  atualizar(): void { this.salvar(); setTimeout(() => this.desenharGrafico()); }
  imprimir(): void {
    this.desenharGrafico();
    this.graficoParaImpressao = this.grafico?.nativeElement.toDataURL('image/png') || '';
    setTimeout(() => window.print());
  }
  novaAvaliacao(): void { if (!window.confirm('Iniciar uma nova avaliação? Os dados atuais serão apagados.')) return; localStorage.removeItem(this.storageKey); this.paciente = this.novoPaciente(); this.observacoes = ''; this.subescalas.forEach(s => s.itens.forEach(i => i.marcado = false)); this.atualizar(); }
  private salvar(): void { try { localStorage.setItem(this.storageKey, JSON.stringify({ paciente:this.paciente, observacoes:this.observacoes, marcados:this.subescalas.map(s => s.itens.map(i => !!i.marcado)) })); } catch {} }
  private carregar(): void { try { const raw = localStorage.getItem(this.storageKey); if (!raw) return; const d = JSON.parse(raw); this.paciente = { ...this.novoPaciente(), ...d.paciente }; this.observacoes = d.observacoes || ''; this.subescalas.forEach((s, si) => s.itens.forEach((i, ii) => i.marcado = !!d.marcados?.[si]?.[ii])); } catch {} }
  private percentisInterpolados(idade: number): Record<number, number> { const m = Math.max(0, Math.min(18, idade)), i = Math.min(17, Math.floor(m)), f = m - i, out: Record<number, number> = {}; Object.keys(this.percentis).map(Number).forEach(p => out[p] = this.percentis[p][i] + (this.percentis[p][i + 1] - this.percentis[p][i]) * f); return out; }
  private desenharGrafico(): void {
    const canvas = this.grafico?.nativeElement; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    const w=canvas.width, h=canvas.height, l=50, r=18, t=18, b=42, pw=w-l-r, ph=h-t-b, x=(m:number)=>l+(m/19)*pw, y=(v:number)=>t+ph-(v/60)*ph;
    ctx.clearRect(0,0,w,h); ctx.fillStyle='#fbfcfe'; ctx.fillRect(l,t,pw,ph); ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=1;
    for(let m=0;m<=19;m++){ ctx.beginPath();ctx.moveTo(x(m),t);ctx.lineTo(x(m),t+ph);ctx.stroke(); }
    for(let v=0;v<=60;v+=5){ ctx.beginPath();ctx.moveTo(l,y(v));ctx.lineTo(l+pw,y(v));ctx.stroke(); }
    ctx.fillStyle='#475569';ctx.font='11px sans-serif';ctx.textAlign='center';for(let m=0;m<=19;m++)ctx.fillText(String(m),x(m),t+ph+17);ctx.fillText('Idade (meses)',l+pw/2,h-5);ctx.textAlign='right';for(let v=0;v<=60;v+=5)ctx.fillText(String(v),l-7,y(v)+4);
    Object.keys(this.percentis).map(Number).forEach(p=>{ctx.beginPath();ctx.strokeStyle=this.cores[p];ctx.lineWidth=p===50?2.6:2;ctx.setLineDash(p===5||p===90?[]:[7,5]);this.percentis[p].forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));ctx.lineTo(x(19),y(58));ctx.stroke();});
    ctx.setLineDash([]);ctx.beginPath();ctx.strokeStyle='#00d9ff';ctx.lineWidth=2.5;
    this.historicoExemplo.forEach((ponto,i)=>i?ctx.lineTo(x(ponto.idadeMeses),y(ponto.pontuacao)):ctx.moveTo(x(ponto.idadeMeses),y(ponto.pontuacao)));ctx.stroke();
    this.historicoExemplo.forEach(ponto=>{const px=x(ponto.idadeMeses),py=y(ponto.pontuacao);ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);ctx.fillStyle='#00d9ff';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke();ctx.fillStyle='#00d9ff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(`${ponto.idadeMeses}m`,px,py-9);});
    const idade=this.idadeClassificacao;if(idade!==null){const px=x(Math.min(idade,19)),py=y(this.total);ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fillStyle='#0f172a';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle='#fff';ctx.stroke();}
    ctx.strokeStyle='#94a3b8';ctx.lineWidth=1.2;ctx.strokeRect(l,t,pw,ph);
  }
}
