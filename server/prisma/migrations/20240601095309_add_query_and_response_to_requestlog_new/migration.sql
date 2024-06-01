/*
  Warnings:

  - Added the required column `query` to the `RequestLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `response` to the `RequestLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RequestLog" ADD COLUMN     "query" TEXT NOT NULL,
ADD COLUMN     "response" TEXT NOT NULL;
