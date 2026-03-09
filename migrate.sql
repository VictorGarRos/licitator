-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('COMUNICACION', 'PUBLICIDAD', 'MEDIOS', 'DIGITAL', 'EVENTOS', 'OTRO');

-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVA', 'ADJUDICADA', 'DESIERTA', 'ANULADA');

-- CreateEnum
CREATE TYPE "Fuente" AS ENUM ('PLACE', 'BOE', 'DOGC', 'BOCM', 'BOJA', 'BORM', 'DOG', 'BOPV');

-- CreateTable
CREATE TABLE "Licitacion" (
    "id" SERIAL NOT NULL,
    "expediente" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "organismo" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "presupuesto" DOUBLE PRECISION NOT NULL,
    "presupuestoIva" DOUBLE PRECISION,
    "plazoOferta" TIMESTAMP(3),
    "fechaPublicacion" TIMESTAMP(3) NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVA',
    "fuente" "Fuente" NOT NULL,
    "urlOriginal" TEXT NOT NULL,
    "cpv" TEXT[],
    "descripcion" TEXT,
    "tipoContrato" TEXT,
    "procedimiento" TEXT,
    "valorContrato" DOUBLE PRECISION,
    "nuevo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Licitacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScraperLog" (
    "id" SERIAL NOT NULL,
    "fuente" "Fuente" NOT NULL,
    "status" TEXT NOT NULL,
    "nuevas" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScraperLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Licitacion_expediente_key" ON "Licitacion"("expediente");

-- CreateIndex
CREATE INDEX "Licitacion_categoria_idx" ON "Licitacion"("categoria");

-- CreateIndex
CREATE INDEX "Licitacion_fuente_idx" ON "Licitacion"("fuente");

-- CreateIndex
CREATE INDEX "Licitacion_plazoOferta_idx" ON "Licitacion"("plazoOferta");

-- CreateIndex
CREATE INDEX "Licitacion_presupuesto_idx" ON "Licitacion"("presupuesto");

-- CreateIndex
CREATE INDEX "Licitacion_fechaPublicacion_idx" ON "Licitacion"("fechaPublicacion");

