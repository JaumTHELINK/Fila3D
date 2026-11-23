-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "precoPorGrama" REAL NOT NULL,
    "estoqueGramas" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");
