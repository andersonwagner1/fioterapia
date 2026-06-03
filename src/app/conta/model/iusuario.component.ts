export interface CadastroUsuarioCompleto {
  // Dados de Login e Permissão
  nome: string;
  email: string;
  funcao: 'ADMINISTRADOR' | 'FISIOTERAPEUTA' | 'ATENDENTE';
  ativo: boolean;

  // Novos Campos Profissionais e Pessoais
  cpf: string;
  telefone: string;
  
  // Exclusivos para quem é Fisioterapeuta (Opcionais para Atendentes)
  crefitoNumero?: string;
  crefitoUf?: string;
  especialidade?: string;
  tempoSessaoMinutos?: number; // Ex: 50

  alterarSenha?: boolean;
}