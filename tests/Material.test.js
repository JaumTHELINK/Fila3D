const Material = require('../src/domain/entities/Material');
const TipoMaterial = require('../src/domain/entities/TipoMaterial');

describe('Entidade Material', () => {
  const dadosValidos = {
    nome: 'Filamento PLA',
    tipo: TipoMaterial.PLA,
    precoPorGrama: 0.12,
    estoqueGramas: 1000,
  };

  it('deve criar material com os dados informados', () => {
    const material = new Material({ id: 1, ...dadosValidos });

    expect(material.id).toBe(1);
    expect(material.nome).toBe('Filamento PLA');
    expect(material.tipo).toBe(TipoMaterial.PLA);
    expect(material.precoPorGrama).toBe(0.12);
    expect(material.estoqueGramas).toBe(1000);
  });

  it('deve aparar espaços no nome e permitir estoque inicial zero', () => {
    const material = new Material({
      ...dadosValidos,
      nome: '  Filamento PETG  ',
      tipo: TipoMaterial.PETG,
      estoqueGramas: 0,
    });

    expect(material.nome).toBe('Filamento PETG');
    expect(material.estoqueGramas).toBe(0);
  });

  it('deve rejeitar dados inválidos', () => {
    expect(() => new Material({ ...dadosValidos, nome: ' ' })).toThrow(
      'O nome é obrigatório',
    );
    expect(() => new Material({ ...dadosValidos, tipo: 'OUTRO' })).toThrow(
      'Tipo de material inválido',
    );
    expect(() => new Material({ ...dadosValidos, precoPorGrama: 0 })).toThrow(
      'O preço por grama deve ser um número maior que zero.',
    );
    expect(() => new Material({ ...dadosValidos, estoqueGramas: -1 })).toThrow(
      'O estoque em gramas deve ser um número não negativo.',
    );
  });

  it('deve verificar disponibilidade de estoque', () => {
    const material = new Material(dadosValidos);

    expect(material.temEstoque(1000)).toBe(true);
    expect(material.temEstoque(1001)).toBe(false);
  });

  it('deve abater e repor estoque', () => {
    const material = new Material(dadosValidos);

    expect(material.abaterEstoque(250)).toBe(750);
    expect(material.reporEstoque(100)).toBe(850);
    expect(material.estoqueGramas).toBe(850);
  });

  it('deve rejeitar abatimento acima do estoque e quantidades inválidas', () => {
    const material = new Material(dadosValidos);

    expect(() => material.abaterEstoque(1001)).toThrow(
      'Estoque insuficiente para essa quantidade.',
    );
    expect(() => material.reporEstoque(0)).toThrow(
      'A quantidade em gramas deve ser um número maior que zero.',
    );
    expect(() => material.temEstoque(-1)).toThrow(
      'A quantidade em gramas deve ser um número maior que zero.',
    );
    expect(material.estoqueGramas).toBe(1000);
  });
});
