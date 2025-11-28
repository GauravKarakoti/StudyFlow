-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('UNIVERSITY', 'LEARN');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "type" "CourseType" NOT NULL DEFAULT 'UNIVERSITY';
