-- CreateTable
CREATE TABLE "FamilyRsvp" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "attending" BOOLEAN NOT NULL,
    "editToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyRsvp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyGuest" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "familyRsvpId" TEXT NOT NULL,

    CONSTRAINT "FamilyGuest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FamilyRsvp_editToken_key" ON "FamilyRsvp"("editToken");

-- AddForeignKey
ALTER TABLE "FamilyGuest" ADD CONSTRAINT "FamilyGuest_familyRsvpId_fkey" FOREIGN KEY ("familyRsvpId") REFERENCES "FamilyRsvp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
