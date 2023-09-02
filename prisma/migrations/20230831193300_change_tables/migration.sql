/*
  Warnings:

  - You are about to drop the column `autor_id` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the `autors` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `author_id` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_autor_id_fkey";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "autor_id",
ADD COLUMN     "author_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "autors";

-- CreateTable
CREATE TABLE "authors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "img" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
