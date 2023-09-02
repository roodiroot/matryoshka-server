/*
  Warnings:

  - You are about to drop the column `userId` on the `tokens` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_userId_fkey";

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "autors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "img" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,

    CONSTRAINT "autors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "autor_id" INTEGER NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "autors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
