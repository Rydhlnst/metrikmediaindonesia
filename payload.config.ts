import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import Users from "./src/collections/Users";
import Categories from "./src/collections/Categories";
import Tags from "./src/collections/Tags";
import Articles from "./src/collections/Articles";
import Media from "./src/collections/Media";
import SiteSettings from "./src/globals/SiteSettings";

const databaseURL = process.env.POSTGRES_URL || "";

export default buildConfig({
  admin: {
    user: Users.slug,
  },

  editor: lexicalEditor({}),

  collections: [Users, Categories, Tags, Articles, Media],

  globals: [SiteSettings],

  secret: process.env.PAYLOAD_SECRET || "change-me-in-production",

  typescript: {
    outputFile: "src/payload-types.ts",
  },

  db: postgresAdapter({
    pool: {
      connectionString: databaseURL,
    },
    push: true,
  }),

  plugins: [
    s3Storage({
      collections: {
        media: {
          disableLocalStorage: true,
        },
      },
      bucket: process.env.R2_BUCKET!,
      config: {
        endpoint: process.env.R2_ENDPOINT!,
        region: "auto",
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
        forcePathStyle: true,
      },
      acl: "public-read",
    }),
  ],
});
