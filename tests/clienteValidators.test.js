const validate = require('../src/interfaces/middlewares/validate');
const {
  criarClienteSchema,
  atualizarClienteSchema,
  idParamSchema,
} = require('../src/interfaces/validators/clienteSchemas');
const TipoCliente = require('../src/domain/entities/TipoCliente');

describe('Validações Zod de Cliente', () => {
  describe('criarClienteSchema', () => {
    it('deve aceitar dados válidos com PESSOA_FISICA', () => {
      const payload = {
        nome: 'João da Silva',
        email: 'joao@email.com',
        tipo: TipoCliente.PESSOA_FISICA,
      };

      const resultado = criarClienteSchema.safeParse(payload);
      expect(resultado.success).toBe(true);
      expect(resultado.data.nome).toBe('João da Silva');
    });

    it('deve aceitar dados válidos com EMPRESA', () => {
      const payload = {
        nome: 'Empresa 3D',
        email: 'contato@empresa3d.com',
        tipo: TipoCliente.EMPRESA,
      };

      const resultado = criarClienteSchema.safeParse(payload);
      expect(resultado.success).toBe(true);
    });

    it('deve rejeitar nome com menos de 2 caracteres', () => {
      const payload = {
        nome: 'A',
        email: 'joao@email.com',
        tipo: TipoCliente.PESSOA_FISICA,
      };

      const resultado = criarClienteSchema.safeParse(payload);
      expect(resultado.success).toBe(false);
      expect(resultado.error.issues[0].path).toContain('nome');
    });

    it('deve rejeitar e-mail em formato inválido', () => {
      const payload = {
        nome: 'João da Silva',
        email: 'email-invalido',
        tipo: TipoCliente.PESSOA_FISICA,
      };

      const resultado = criarClienteSchema.safeParse(payload);
      expect(resultado.success).toBe(false);
      expect(resultado.error.issues[0].path).toContain('email');
    });

    it('deve rejeitar tipo inválido', () => {
      const payload = {
        nome: 'João da Silva',
        email: 'joao@email.com',
        tipo: 'INVALIDO',
      };

      const resultado = criarClienteSchema.safeParse(payload);
      expect(resultado.success).toBe(false);
      expect(resultado.error.issues[0].path).toContain('tipo');
    });

    it('deve rejeitar payload vazio', () => {
      const resultado = criarClienteSchema.safeParse({});
      expect(resultado.success).toBe(false);
      expect(resultado.error.issues.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('atualizarClienteSchema', () => {
    it('deve aceitar atualização parcial com apenas um campo válido', () => {
      const resNome = atualizarClienteSchema.safeParse({ nome: 'Novo Nome' });
      const resEmail = atualizarClienteSchema.safeParse({
        email: 'novo@email.com',
      });
      const resTipo = atualizarClienteSchema.safeParse({
        tipo: TipoCliente.EMPRESA,
      });

      expect(resNome.success).toBe(true);
      expect(resEmail.success).toBe(true);
      expect(resTipo.success).toBe(true);
    });

    it('deve rejeitar body vazio exigindo pelo menos um campo', () => {
      const resultado = atualizarClienteSchema.safeParse({});
      expect(resultado.success).toBe(false);
      expect(resultado.error.issues[0].message).toContain(
        'Pelo menos um campo deve ser informado',
      );
    });

    it('deve rejeitar campo inválido na atualização', () => {
      const resultado = atualizarClienteSchema.safeParse({ email: 'errado' });
      expect(resultado.success).toBe(false);
      expect(resultado.error.issues[0].path).toContain('email');
    });
  });

  describe('idParamSchema', () => {
    it('deve converter string numérica em número inteiro positivo', () => {
      const resultado = idParamSchema.safeParse({ id: '42' });
      expect(resultado.success).toBe(true);
      expect(resultado.data.id).toBe(42);
    });

    it('deve rejeitar id zero ou negativo', () => {
      const resZero = idParamSchema.safeParse({ id: '0' });
      const resNeg = idParamSchema.safeParse({ id: '-1' });

      expect(resZero.success).toBe(false);
      expect(resNeg.success).toBe(false);
    });

    it('deve rejeitar id não numérico', () => {
      const resultado = idParamSchema.safeParse({ id: 'abc' });
      expect(resultado.success).toBe(false);
    });

    it('deve rejeitar id decimal', () => {
      const resultado = idParamSchema.safeParse({ id: '2.5' });
      expect(resultado.success).toBe(false);
    });
  });

  describe('Middleware validate', () => {
    it('deve substituir req[origem] pelo valor sanitizado e chamar next() em caso de sucesso', () => {
      const middleware = validate(idParamSchema, 'params');
      const req = { params: { id: '15' } };
      const res = {};
      const next = jest.fn();

      middleware(req, res, next);

      expect(req.params.id).toBe(15);
      expect(next).toHaveBeenCalledWith();
    });

    it('deve chamar next com erro 400 e lista de problemas em caso de falha', () => {
      const middleware = validate(criarClienteSchema, 'body');
      const req = { body: { nome: 'A' } };
      const res = {};
      const next = jest.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const erro = next.mock.calls[0][0];
      expect(erro).toBeDefined();
      expect(erro.statusCode).toBe(400);
      expect(Array.isArray(erro.issues)).toBe(true);
      expect(erro.issues[0]).toHaveProperty('campo');
      expect(erro.issues[0]).toHaveProperty('mensagem');
    });
  });
});

