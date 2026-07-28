import type { CollectionConfig } from "payload";

const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Media",
    plural: "Media",
  },
  admin: {
    useAsTitle: "alt",
    group: "System",
  },
  upload: {
    mimeTypes: ["image/*"],
    imageSizes: [
      {
        name: "thumbnail",
        width: 150,
        height: 150,
        position: "centre",
      },
      {
        name: "card",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "hero",
        width: 1200,
        height: 675,
        position: "centre",
      },
      {
        name: "og",
        width: 1200,
        height: 630,
        position: "centre",
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Alternative text for accessibility and SEO",
      },
    },
    {
      name: "caption",
      type: "text",
    },
  ],
};

export default Media;
