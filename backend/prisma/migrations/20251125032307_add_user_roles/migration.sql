-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ARTIST', 'PREMIUM_USER', 'FREE_USER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'FREE_USER';
