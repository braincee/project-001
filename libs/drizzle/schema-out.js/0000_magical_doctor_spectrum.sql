CREATE TABLE IF NOT EXISTS "caption" (
	"videoId" text PRIMARY KEY NOT NULL,
	"thumbnail" text NOT NULL,
	"youtuberId" text NOT NULL,
	"transcribedWithLyrics" text,
	"captionChunks" text NOT NULL,
	"videoTitle" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "caption_videoId_unique" UNIQUE("videoId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "polls" (
	"id" uuid PRIMARY KEY NOT NULL,
	"options" json,
	"enabled" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "votes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"picked_option" uuid,
	"poll" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "youtuber" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "youtuber_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_poll_polls_id_fk" FOREIGN KEY ("poll") REFERENCES "polls"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
