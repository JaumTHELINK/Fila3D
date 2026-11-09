const Cliente = require('../src/domain/entities/Cliente');
const TipoCliente = require('../src/domain/entities/TipoCliente');

describe('Entidade Cliente', () => {
  describe('Criação com dados válidos', () => {
    it('deve criar uma instância de Cliente com todos os dados via objeto', () => {
      const cliente = new Cliente({
        id: 1,
        nome: 'João da Silva',
        email: 'joao@email.com',
        tipo: TipoCliente.PESSOA_FISICA,
      });

      expect(cliente.id).toBe(1);
      expect(cliente.nome).toBe('João da Silva');
      expect(cliente.email).toBe('joao@email.com');
      expect(cliente.tipo).toBe(TipoCliente.PESSOA_FISICA);
    });

    it('deve criar cliente como EMPRESA', () => {
      const cliente = new Cliente({
        id: 2,
        nome: 'Empresa 3D LTDA',
        email: 'contato@empresa3d.com',
        tipo: TipoCliente.EMPRESA,
      });

      expect(cliente.tipo).toBe(TipoCliente.EMPRESA);
    });

    it('deve definir id como null quando não for informado', () => {
      const cliente = new Cliente({
        nome: 'Maria Souza',
        email: 'maria@email.com',
        tipo: TipoCliente.PESSOA_FISICA,
      });

      expect(cliente.id).toBeNull();
    });

    it('deve aparar (trim) o nome e normalizar email para minúsculo', () => {
      const cliente = new Cliente({
        nome: '  Carlos Eduardo  ',
        email: '  Carlos.Eduardo@Email.COM  ',
        tipo: TipoCliente.PESSOA_FISICA,
      });

      expect(cliente.nome).toBe('Carlos Eduardo');
      expect(cliente.email).toBe('carlos.eduardo@email.com');
    });

    it('deve permitir criação passando argumentos posicionais (nome, email, tipo)', () => {
      const cliente = new Cliente(
        'Ana Paula',
        'ana@email.com',
        TipoCliente.PESSOA_FISICA,
      );

      expect(cliente.id).toBeNull();
      expect(cliente.nome).toBe('Ana Paula');
      expect(cliente.email).toBe('ana@email.com');
      expect(cliente.tipo).toBe(TipoCliente.PESSOA_FISICA);
    });

    it('deve permitir criação passando argumentos posicionais com id numérico', () => {
      const cliente = new Cliente(
        10,
        'Ana Paula',
        'ana@email.com',
        TipoCliente.PESSOA_FISICA,
      );

      expect(cliente.id).toBe(10);
      expect(cliente.nome).toBe('Ana Paula');
    });
  });

  describe('Validações do campo nome', () => {
    it('deve lançar erro se o nome for nulo ou indefinido', () => {
      expect(() => {
        new Cliente({
          email: 'joao@email.com',
          tipo: TipoCliente.PESSOA_FISICA,
        });
      }).toThrow('O nome é obrigatório e deve ter no mínimo 2 caracteres.');
    });

    it('deve lançar erro se o nome tiver menos de 2 caracteres', () => {
      expect(() => {
        new Cliente({
          nome: 'A',
          email: 'joao@email.com',
          tipo: TipoCliente.PESSOA_FISICA,
        });
      }).toThrow('O nome é obrigatório e deve ter no mínimo 2 caracteres.');
    });

    it('deve lançar erro se o nome for composto apenas por espaços', () => {
      expect(() => {
        new Cliente({
          nome: '   ',
          email: 'joao@email.com',
          tipo: TipoCliente.PESSOA_FISICA,
        });
      }).toThrow('O nome é obrigatório e deve ter no mínimo 2 caracteres.');
    });

    it('deve lançar erro se o nome não for do tipo string', () => {
      expect(() => {
        new Cliente({
          nome: 12345,
          email: 'joao@email.com',
          tipo: TipoCliente.PESSOA_FISICA,
        });
      }).toThrow('O nome é obrigatório e deve ter no mínimo 2 caracteres.');
    });
  });

  describe('Validações do campo email', () => {
    it('deve lançar erro se o email for nulo ou indefinido', () => {
      expect(() => {
        new Cliente({ nome: 'João da Silva', tipo: TipoCliente.PESSOA_FISICA });
      }).toThrow('O e-mail informado é inválido.');
    });

    it('deve lançar erro para formatos de email inválidos', () => {
      const emailsInvalidos = [
        '',
        'sem-arroba',
        'sem-dominio@',
        '@sem-usuario.com',
        'usuario@dominio',
        'usuario com espaco@dominio.com',
      ];

      emailsInvalidos.forEach((emailInvalido) => {
        expect(() => {
          new Cliente({
            nome: 'João da Silva',
            email: emailInvalido,
            tipo: TipoCliente.PESSOA_FISICA,
          });
        }).toThrow('O e-mail informado é inválido.');
      });
    });

    it('deve lançar erro se o email não for uma string', () => {
      expect(() => {
        new Cliente({
          nome: 'João da Silva',
          email: 999,
          tipo: TipoCliente.PESSOA_FISICA,
        });
      }).toThrow('O e-mail informado é inválido.');
    });
  });

  describe('Validações do campo tipo', () => {
    it('deve lançar erro se o tipo for nulo ou indefinido', () => {
      expect(() => {
        new Cliente({ nome: 'João da Silva', email: 'joao@email.com' });
      }).toThrow('Tipo de cliente inválido.');
    });

    it('deve lançar erro se o tipo for diferente dos valores do enum TipoCliente', () => {
      expect(() => {
        new Cliente({
          nome: 'João da Silva',
          email: 'joao@email.com',
          tipo: 'OUTRO_TIPO',
        });
      }).toThrow('Tipo de cliente inválido.');
    });
  });
});
