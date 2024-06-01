/*
  Warnings:

  - You are about to drop the column `isSuperUser` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isSuperUser",
ADD COLUMN     "superUserKey" TEXT;
