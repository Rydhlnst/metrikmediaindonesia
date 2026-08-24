import { z } from "zod";

const optionalUrl = z.union([z.string().url().max(2_000), z.literal("")]).transform((value) => value || null);

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(3).max(255),
  message: z.string().trim().min(10).max(10_000),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(255),
  source: z.string().trim().min(1).max(50).optional().default("footer"),
});

export const businessPublicationSchema = z.object({
  companyName: z.string().trim().min(2).max(200),
  contactName: z.string().trim().min(2).max(150),
  companyWebsite: optionalUrl.optional().default(null),
  industry: z.string().trim().max(100).optional().nullable(),
  contactEmail: z.string().trim().email().max(255),
  contactPhone: z.string().trim().min(7).max(50),
  articleTitle: z.string().trim().min(10).max(255),
  articleContent: z.string().trim().min(50).max(100_000),
  attachments: z.array(z.string().url().max(2_000)).max(10).optional().default([]),
});

export const businessPublicationReviewSchema = z.object({
  status: z.enum(["under_review", "revision_required", "approved", "rejected", "scheduled", "published"]),
  reviewNote: z.string().trim().max(5_000).nullable().optional(),
  articleId: z.coerce.number().int().positive().nullable().optional(),
});

export const advertisementSchema = z.object({
  title: z.string().trim().min(2).max(255),
  advertiserName: z.string().trim().max(150).optional().nullable(),
  image: optionalUrl.optional().default(null),
  desktopImage: optionalUrl.optional().default(null),
  mobileImage: optionalUrl.optional().default(null),
  link: optionalUrl.optional().default(null),
  position: z.enum(["homepage", "article_top", "article_middle", "sidebar", "category", "header", "footer", "inline"]),
  status: z.enum(["active", "inactive", "draft"]).default("active"),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
}).refine((value) => !value.startDate || !value.endDate || new Date(value.startDate) <= new Date(value.endDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const redirectSchema = z.object({
  oldUrl: z.string().trim().startsWith("/").max(2_000),
  newUrl: z.string().trim().min(1).max(2_000),
  statusCode: z.union([z.literal(301), z.literal(302)]).default(301),
  isActive: z.boolean().default(true),
});

export const userCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
  roleId: z.coerce.number().int().positive().nullable().optional(),
  avatar: optionalUrl.optional().default(null),
  isActive: z.boolean().optional().default(true),
});

export const userUpdateSchema = userCreateSchema.omit({ password: true }).partial().refine((value) => Object.keys(value).length > 0, "At least one field is required");

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const imageUploadOptionsSchema = z.object({
  maxWidth: z.coerce.number().int().min(64).max(4_096).default(1_920),
  maxHeight: z.coerce.number().int().min(64).max(4_096).default(1_080),
});

export const avatarQuerySchema = z.object({
  seed: z.string().trim().min(1).max(100).default("A"),
  size: z.coerce.number().int().min(32).max(512).default(128),
});

export const milestoneQuerySchema = z.object({
  preview: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
  forceMilestone: z.enum(["3_months", "6_months", "1_year", "2_years", "annual"]).nullable().optional(),
  testEmail: z.string().trim().email().nullable().optional(),
  name: z.string().trim().max(100).optional(),
  slug: z.string().trim().max(150).optional(),
  articles: z.coerce.number().int().min(0).max(1_000_000).default(0),
  views: z.coerce.number().int().min(0).max(2_000_000_000).default(0),
});
