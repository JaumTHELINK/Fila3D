const Material = require('../src/domain/entities/Material');
const TipoMaterial = require('../src/domain/entities/TipoMaterial');

describe('Entidade Material', () => {
  const dados = {
    nome: 'Filamento PLA',
    tipo: TipoMaterial.PLA,
    precoPorGrama: 0.12,
    estoqueGramas: 1000,
  };

  it('deve criar material e normalizar o nome', () => {
    const material = new Material({ ...dados, nome: '  Filamento PLA  ' });

    expect(material.id).toBeNull();
    expect(material.nome).toBe('Filamento PLA');
    expect(material.tipo).toBe(TipoMaterial.PLA);
  });

  it('deve rejeitar campos inválidos', () => {
    expect(() => new Material({ ...dados, nome: ' ' })).toThrow(
      'O nome é obrigatório',
    );
    expect(() => new Material({ ...dados, tipo: 'NYLON' })).toThrow(
      'Tipo de material inválido',
    );
    expect(() => new Material({ ...dados, precoPorGrama: 0 })).toThrow(
      'O preço por grama deve ser um número maior que zero.',
    );
    expect(() => new Material({ ...dados, estoqueGramas: -1 })).toThrow(
      'O estoque em gramas deve ser um número não negativo.',
    );
  });

  it('deve conferir, abater e repor o estoque', () => {
    const material = new Material(dados);

    expect(material.temEstoque(1001)).toBe(false);
    expect(material.abaterEstoque(250)).toBe(750);
    expect(material.reporEstoque(100)).toBe(850);
  });

  it('deve impedir estoque negativo e quantidades inválidas', () => {
    const material = new Material(dados);

    expect(() => material.abaterEstoque(1001)).toThrow(
      'Estoque insuficiente para essa quantidade.',
    );
    expect(() => material.reporEstoque(0)).toThrow(
      'A quantidade em gramas deve ser um número maior que zero.',
    );
    expect(material.estoqueGramas).toBe(1000);
  });
});
