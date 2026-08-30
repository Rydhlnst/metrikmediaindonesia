"use client";

import { toast } from "sonner";
import { toIndonesianErrorMessage } from "@/lib/error-message";

type ErrorPayload = { message?: string; error?: { code?: string; message?: string; fields?: Record<string, string[]> } };

export class ApiClientError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string, public readonly fields?: Record<string, string[]>) { super(message); }
}

export async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await response.json().catch(() => null) as ErrorPayload | T | null;
  if (response.ok) return payload as T;
  const error = payload as ErrorPayload | null;
  const fallback = response.status === 401
    ? "Silakan masuk terlebih dahulu."
    : response.status === 403
      ? "Anda tidak memiliki akses untuk tindakan ini."
      : response.status === 404
        ? "Data yang diminta tidak ditemukan."
        : response.status === 429
          ? "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi."
          : response.status >= 500
            ? "Layanan sedang bermasalah. Coba lagi beberapa saat."
            : "Data yang dikirim belum benar. Periksa isian lalu coba lagi.";
  throw new ApiClientError(response.status, error?.error?.code || "REQUEST_FAILED", toIndonesianErrorMessage(error?.error?.message || error?.message, fallback), error?.error?.fields);
}

export function toastApiError(error: unknown) {
  if (error instanceof ApiClientError) {
    const fieldMessage = error.fields ? Object.values(error.fields).flat()[0] : undefined;
    const title = error.status === 400 || error.status === 422
      ? "Data belum benar"
      : error.status === 401
        ? "Silakan masuk terlebih dahulu"
        : error.status === 403
          ? "Akses ditolak"
          : error.status === 404
            ? "Data tidak ditemukan"
            : error.status === 409
              ? "Data sudah digunakan"
              : error.status === 429
                ? "Terlalu banyak permintaan"
                : error.status >= 500
                  ? "Layanan sedang bermasalah"
                  : "Permintaan gagal";
    toast.error(title, { description: toIndonesianErrorMessage(fieldMessage, error.message) });
    return;
  }
  toast.error("Terjadi kesalahan", { description: "Coba lagi beberapa saat." });
}
