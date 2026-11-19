import { CraniometriaAvaliacao } from './craniometria.component';

/** Dados fictícios para validação manual e testes unitários da tela. */
export const CRANIOMETRIA_MOCK: CraniometriaAvaliacao = {
  paciente: 'Bebê de teste',
  registro: 'MOCK-001',
  dataAvaliacao: '2025-02-14',
  comprimento: 140,
  largura: 120,
  diagonalMaior: 130,
  diagonalMenor: 120,
  percentilMotor: 50,
  argenta: 'Tipo III',
  observacoes: 'Dados fictícios para teste do cálculo e da apresentação dos resultados.'
};
