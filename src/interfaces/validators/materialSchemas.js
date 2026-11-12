const { z } = require('zod');
const TipoMaterial = require('../../domain/entities/TipoMaterial');

const tipoMaterialSchema = z.enum(
  [TipoMaterial.PLA, TipoMaterial.PETG, TipoMaterial.ABS, TipoMaterial.TPU],
  {
    message: 'O tipo deve ser PLA, PETG, ABS ou TPU.',
  },
);

const precoPorGramaSchema = z
  .number({ message: 'O preço por grama deve ser um número.' })
  .positive('O preço por grama deve ser maior que zero.');

const estoqueGramasSchema = z
  .number({ message: 'O estoque em gramas deve ser um número.' })
  .nonnegative('O estoque em gramas não pode ser negativo.');

const criarMaterialSchema = z.object({
  nome: z
    .string({ message: 'O nome é obrigatório e deve ser um texto.' })
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres.'),
  tipo: tipoMaterialSchema,
  precoPorGrama: precoPorGramaSchema,
  estoqueGramas: estoqueGramasSchema,
});

const atualizarMaterialSchema = z
  .object({
    nome: z
      .string({ message: 'O nome deve ser um texto.' })
      .trim()
      .min(2, 'O nome deve ter no mínimo 2 caracteres.')
      .optional(),
    tipo: tipoMaterialSchema.optional(),
    precoPorGrama: precoPorGramaSchema.optional(),
    estoqueGramas: estoqueGramasSchema.optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0, {
    message: 'Pelo menos um campo deve ser informado para atualização.',
  });

const movimentarEstoqueSchema = z.object({
  gramas: z
    .number({ message: 'A quantidade em gramas deve ser um número.' })
    .positive('A quantidade em gramas deve ser maior que zero.'),
});

const idParamSchema = z.object({
  id: z.coerce
    .number({ message: 'O ID deve ser um número válido.' })
    .int('O ID deve ser um número inteiro.')
    .positive('O ID deve ser um número positivo.'),
});

module.exports = {
  criarMaterialSchema,
  atualizarMaterialSchema,
  movimentarEstoqueSchema,
  idParamSchema,
};
