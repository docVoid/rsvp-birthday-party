-- CreateTable
CREATE TABLE "BringItem" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "rsvpId" TEXT NOT NULL,

    CONSTRAINT "BringItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BringItem" ADD CONSTRAINT "BringItem_rsvpId_fkey" FOREIGN KEY ("rsvpId") REFERENCES "Rsvp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
