import type { CollectionConfig } from "payload";

const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "User",
    plural: "Users",
  },
  admin: {
    useAsTitle: "email",
    group: "System",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "author",
      options: [
        { label: "Super Admin", value: "super-admin" },
        { label: "Editor", value: "editor" },
        { label: "Author", value: "author" },
        { label: "Reporter", value: "reporter" },
      ],
    },
    {
      name: "avatar",
      type: "text",
    },
    {
      name: "bio",
      type: "textarea",
    },
  ],
};

export default Users;
