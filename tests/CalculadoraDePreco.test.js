const CalculadoraDePreco = require('../src/domain/services/CalculadoraDePreco');
const PrecoStrategy = require('../src/domain/strategies/PrecoStrategy');
const PrecoPessoaFisicaStrategy = require('../src/domain/strategies/PrecoPessoaFisicaStrategy');
const PrecoEmpresaStrategy = require('../src/domain/strategies/PrecoEmpresaStrategy');

describe('CalculadoraDePreco (Strategy)', () => {
  it('pessoa física: 100g x 0,15 + 2h x 50 = 115', () => {
    const calculadora = new CalculadoraDePreco(new PrecoPessoaFisicaStrategy());
    expect(calculadora.calcular(100, 2, 0.15)).toBe(115);
  });

  it('empresa: 115 com 15% de desconto = 97,75', () => {
    const calculadora = new CalculadoraDePreco(new PrecoEmpresaStrategy());
    expect(calculadora.calcular(100, 2, 0.15)).toBe(97.75);
  });

  it('deve delegar o cálculo para a strategy recebida', () => {
    const strategy = { calcular: jest.fn().mockReturnValue(42) };
    const calculadora = new CalculadoraDePreco(strategy);

    expect(calculadora.calcular(10, 1, 0.2)).toBe(42);
    expect(strategy.calcular).toHaveBeenCalledWith(10, 1, 0.2);
  });

  it('deve lançar erro se a strategy não for fornecida', () => {
    expect(() => new CalculadoraDePreco()).toThrow(
      'Uma PrecoStrategy deve ser fornecida à calculadora.',
    );
    expect(() => new CalculadoraDePreco(null)).toThrow();
  });

  it('a interface base PrecoStrategy deve lançar "Método não implementado"', () => {
    expect(() => new PrecoStrategy().calcular(1, 1, 1)).toThrow(
      'Método não implementado',
    );
  });
});
