import type { GlobalConfig } from "payload";

const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "System",
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      defaultValue: "Metrik Media Indonesia",
      required: true,
    },
    {
      name: "tagline",
      type: "text",
      defaultValue: "Portal Berita Terpercaya",
    },
    {
      name: "description",
      type: "textarea",
      defaultValue:
        "Portal berita terpercaya, terkini, dan akurat dari Metrik Media Indonesia",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "company",
      type: "text",
      defaultValue: "PT Prima Mutiara Media",
    },
    {
      type: "group",
      name: "social",
      label: "Social Media",
      fields: [
        { name: "twitter", type: "text", label: "Twitter/X URL" },
        { name: "facebook", type: "text", label: "Facebook URL" },
        { name: "instagram", type: "text", label: "Instagram URL" },
        { name: "youtube", type: "text", label: "YouTube URL" },
        { name: "linkedin", type: "text", label: "LinkedIn URL" },
      ],
    },
    {
      type: "group",
      name: "contact",
      label: "Contact Info",
      fields: [
        { name: "email", type: "email" },
        { name: "phone", type: "text" },
        { name: "address", type: "textarea" },
      ],
    },
    {
      type: "group",
      name: "seo",
      label: "Default SEO",
      fields: [
        {
          name: "metaTitle",
          type: "text",
          maxLength: 60,
          admin: {
            description: "Default meta title for all pages (max 60 characters)",
          },
        },
        {
          name: "metaDescription",
          type: "textarea",
          maxLength: 160,
          admin: {
            description:
              "Default meta description for all pages (max 160 characters)",
          },
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Default Open Graph image (recommended: 1200x630px)",
          },
        },
      ],
    },
  ],
};

export default SiteSettings;
