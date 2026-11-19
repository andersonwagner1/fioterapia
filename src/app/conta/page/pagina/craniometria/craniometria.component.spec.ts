import { CraniometriaComponent } from './craniometria.component';
import { CRANIOMETRIA_MOCK } from './craniometria.mock';
import { ProntuarioService } from '../../../service/prontuario.sevice';

const prontuarioServiceMock = {} as ProntuarioService;

describe('CraniometriaComponent', () => {
  it('calcula CVAI com o mock', () => {
    const component = new CraniometriaComponent(prontuarioServiceMock);
    component.avaliacao = { ...CRANIOMETRIA_MOCK };
    expect(component.cvai).toBeCloseTo(8.3333, 2);
    expect(component.classificacaoCvai).toBe('Moderada');
  });

  it('calcula IC e classificação com o mock', () => {
    const component = new CraniometriaComponent(prontuarioServiceMock);
    component.avaliacao = { ...CRANIOMETRIA_MOCK };
    expect(component.ic).toBeCloseTo(85.7142, 2);
    expect(component.classificacaoIc).toBe('Sem braquicefalia');
  });

  it('não calcula quando faltam medidas', () => {
    const component = new CraniometriaComponent(prontuarioServiceMock);
    expect(component.cvai).toBeNull();
    expect(component.ic).toBeNull();
  });
});
