const { z } = require('zod');
const TipoCliente = require('../../domain/entities/TipoCliente');

const criarClienteSchema = z.object({
  nome: z
    .string({ message: 'O nome é obrigatório e deve ser um texto.' })
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres.'),
  email: z
    .string({ message: 'O e-mail é obrigatório.' })
    .trim()
    .email('O e-mail informado é inválido.'),
  tipo: z.enum([TipoCliente.PESSOA_FISICA, TipoCliente.EMPRESA], {
    message: 'O tipo deve ser PESSOA_FISICA ou EMPRESA.',
  }),
});

const atualizarClienteSchema = z
  .object({
    nome: z
      .string({ message: 'O nome deve ser um texto.' })
      .trim()
      .min(2, 'O nome deve ter no mínimo 2 caracteres.')
      .optional(),
    email: z
      .string({ message: 'O e-mail deve ser um texto.' })
      .trim()
      .email('O e-mail informado é inválido.')
      .optional(),
    tipo: z
      .enum([TipoCliente.PESSOA_FISICA, TipoCliente.EMPRESA], {
        message: 'O tipo deve ser PESSOA_FISICA ou EMPRESA.',
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser informado para atualização.',
  });

const idParamSchema = z.object({
  id: z.coerce
    .number({ message: 'O ID deve ser um número válido.' })
    .int('O ID deve ser um número inteiro.')
    .positive('O ID deve ser um número positivo.'),
});

module.exports = {
  criarClienteSchema,
  atualizarClienteSchema,
  idParamSchema,
};

