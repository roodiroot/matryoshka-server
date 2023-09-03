/*
  Warnings:

  - You are about to drop the column `reviewId` on the `projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[project_id]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `project_id` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_reviewId_fkey";

-- DropIndex
DROP INDEX "projects_reviewId_key";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "reviewId";

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "project_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_project_id_key" ON "reviews"("project_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
