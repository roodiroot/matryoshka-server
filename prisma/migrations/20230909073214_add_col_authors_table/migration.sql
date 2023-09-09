-- CreateEnum
CREATE TYPE "AuthorRole" AS ENUM ('TEAM', 'CLIENT');

-- AlterTable
ALTER TABLE "authors" ADD COLUMN     "type" "AuthorRole";
