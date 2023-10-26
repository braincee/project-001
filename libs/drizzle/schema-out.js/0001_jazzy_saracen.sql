ALTER TABLE "polls" ALTER COLUMN "enabled" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "polls" ALTER COLUMN "enabled" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "caption" ADD COLUMN "youTuberId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "caption" DROP COLUMN IF EXISTS "youtuberId";