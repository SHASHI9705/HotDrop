-- DropForeignKey
ALTER TABLE "PushSubscription" DROP CONSTRAINT "PushSubscription_partnerId_fkey";

-- AlterTable
ALTER TABLE "PushSubscription" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "partnerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Signup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
