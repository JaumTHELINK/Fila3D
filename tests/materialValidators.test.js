const TipoMaterial = require('../src/domain/entities/TipoMaterial');
const {
  criarMaterialSchema,
  atualizarMaterialSchema,
  movimentarEstoqueSchema,
} = require('../src/interfaces/validators/materialSchemas');

describe('Schemas de Material', () => {
  const materialValido = {
    nome: 'Filamento PLA',
    tipo: TipoMaterial.PLA,
    precoPorGrama: 0.12,
    estoqueGramas: 1000,
  };

  it('deve aceitar material válido e normalizar espaços no nome', () => {
    const resultado = criarMaterialSchema.safeParse({
      ...materialValido,
      nome: '  Filamento PLA  ',
    });

    expect(resultado.success).toBe(true);
    expect(resultado.data.nome).toBe('Filamento PLA');
  });

  it('deve rejeitar tipo, preço e estoque inválidos', () => {
    expect(
      criarMaterialSchema.safeParse({ ...materialValido, tipo: 'NYLON' })
        .success,
    ).toBe(false);
    expect(
      criarMaterialSchema.safeParse({ ...materialValido, precoPorGrama: 0 })
        .success,
    ).toBe(false);
    expect(
      criarMaterialSchema.safeParse({ ...materialValido, estoqueGramas: -1 })
        .success,
    ).toBe(false);
  });

  it('deve aceitar atualizações parciais e rejeitar body vazio', () => {
    expect(
      atualizarMaterialSchema.safeParse({ nome: 'PLA Premium' }).success,
    ).toBe(true);
    expect(atualizarMaterialSchema.safeParse({}).success).toBe(false);
  });

  it('deve exigir quantidade positiva para movimentação de estoque', () => {
    expect(movimentarEstoqueSchema.safeParse({ gramas: 50 }).success).toBe(
      true,
    );
    expect(movimentarEstoqueSchema.safeParse({ gramas: 0 }).success).toBe(
      false,
    );
    expect(movimentarEstoqueSchema.safeParse({ gramas: -1 }).success).toBe(
      false,
    );
  });
});
