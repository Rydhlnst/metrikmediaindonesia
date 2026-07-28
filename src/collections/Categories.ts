import type { CollectionConfig } from "payload";

const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    singular: "Category",
    plural: "Categories",
  },
  admin: {
    useAsTitle: "name",
    group: "Content",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "color",
      type: "text",
      defaultValue: "#ea580c",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "featuredImage",
      type: "text",
    },
  ],
};

export default Categories;
