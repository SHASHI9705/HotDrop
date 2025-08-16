-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "coupon" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "offerPercent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);
