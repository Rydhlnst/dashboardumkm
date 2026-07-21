CREATE TABLE "area_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"area" varchar(100) NOT NULL,
	"expansion_status" varchar(20) DEFAULT 'closed' NOT NULL,
	"pks_status" varchar(20) DEFAULT 'not_available' NOT NULL,
	"timeline_status" varchar(20) DEFAULT 'planned' NOT NULL,
	"target_date" varchar(30) DEFAULT '' NOT NULL,
	"new_stores" json DEFAULT '[]'::json NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"lat" double precision DEFAULT 0 NOT NULL,
	"lng" double precision DEFAULT 0 NOT NULL,
	"short_name" varchar(20) DEFAULT '' NOT NULL,
	"trend" varchar(10) DEFAULT 'stable' NOT NULL,
	"trend_value" double precision DEFAULT 0 NOT NULL,
	"participants" integer DEFAULT 0 NOT NULL,
	"md_progress" integer DEFAULT 0 NOT NULL,
	"active_items" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "area_settings_area_unique" UNIQUE("area")
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"no" integer NOT NULL,
	"kode" varchar(20) NOT NULL,
	"nama" varchar(255) NOT NULL,
	"alamat" text NOT NULL,
	"kelurahan" varchar(255) NOT NULL,
	"kecamatan" varchar(255) NOT NULL,
	"kabupaten" varchar(255) NOT NULL,
	"area" varchar(100) NOT NULL,
	"nama_ac" varchar(255) NOT NULL,
	"nama_am" varchar(255) NOT NULL,
	"umkm" varchar(10) NOT NULL,
	"sarana_promosi" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "umkm_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"no" integer NOT NULL,
	"wilayah" varchar(100) NOT NULL,
	"kode_supp" varchar(50) NOT NULL,
	"nama_supp" varchar(255) NOT NULL,
	"plu" integer NOT NULL,
	"nama_produk" varchar(255) NOT NULL,
	"total_plu" integer NOT NULL,
	"keterangan" varchar(50) NOT NULL
);
