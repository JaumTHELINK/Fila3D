# Justificativa: Singleton (GoF nº 2) e Repository (GRASP)

## Singleton: `DatabaseConnection`

**Onde está:** `src/infrastructure/database/DatabaseConnection.js`
(`src/database/index.js` apenas reexporta o client dele).

**Problema que resolve:** cada `new PrismaClient()` abre seu próprio pool de
conexões. Se cada repository ou módulo criasse o seu, a aplicação abriria várias
conexões ao mesmo banco, desperdiçando recursos e podendo esgotar o limite do
servidor.

**Como resolve:** o construtor só aceita um token interno (equivale ao
construtor privado do diagrama UML). O único jeito de obter a conexão é
`DatabaseConnection.getInstance()`, que cria o objeto na primeira chamada e
devolve sempre o mesmo depois. `getClient()` entrega o `PrismaClient`.

**Fluxo:** `getInstance()` → mesma instância → `getClient()` → `PrismaClient`
→ injetado nos repositories em `src/container.js`.

## Repository com GRASP

**Onde está:** contratos em `src/domain/repositories/I*Repository.js` e
implementações em `src/infrastructure/repositories/*RepositoryPrisma.js`.

Repository é um padrão de acesso a dados. Ele se justifica por estes princípios
GRASP:

| Princípio GRASP          | Como aparece no Repository                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Pure Fabrication**     | A classe não existe no domínio do negócio. Foi criada só para concentrar o acesso a dados e manter as entidades puras. |
| **Low Coupling**         | Services dependem da interface (`IClienteRepository`), nunca de Prisma. O `PrismaClient` é injetado pelo construtor.   |
| **Protected Variations** | Se o banco ou o ORM mudar, só a implementação `*RepositoryPrisma` muda. Services e controllers ficam intactos.         |
| **Information Expert**   | Quem conhece o formato do registro no banco (o repository) é quem converte para a entidade.                            |

## Como os dois se conectam

`DatabaseConnection` (Singleton) fornece **um** client → `container.js` injeta
esse client nos repositories → repositories são injetados nos services. Cada
camada conhece só a abstração da camada de baixo.
