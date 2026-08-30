const knownMessages: Array<[RegExp, string]> = [
  [/request failed|please try again|failed to fetch|network request failed/i, "Layanan tidak dapat dihubungi. Coba lagi beberapa saat."],
  [/sign in required|authentication required|unauthorized/i, "Silakan masuk terlebih dahulu."],
  [/access denied|forbidden/i, "Anda tidak memiliki akses untuk tindakan ini."],
  [/not found|unavailable/i, "Data yang diminta tidak ditemukan atau sudah tidak tersedia."],
  [/invalid .*id|invalid id/i, "ID data tidak valid."],
  [/too many requests|rate limit/i, "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi."],
  [/internal server error|service unavailable|server error/i, "Layanan sedang bermasalah. Coba lagi beberapa saat."],
  [/already in use|already exists/i, "Data tersebut sudah digunakan. Gunakan nilai lain."],
  [/required|must be|is required/i, "Data belum lengkap. Isi semua bagian yang wajib lalu coba lagi."],
  [/invalid|not valid/i, "Data yang dikirim tidak valid. Periksa kembali lalu coba lagi."],
  [/could not|unable to|failed|error/i, "Tindakan gagal. Periksa data dan koneksi layanan lalu coba lagi."],
];

export function toIndonesianErrorMessage(message: string | undefined, fallback: string): string {
  const value = message?.trim();
  if (!value) return fallback;
  const knownMessage = knownMessages.find(([pattern]) => pattern.test(value));
  if (knownMessage) return knownMessage[1];
  if (/\b(gagal|tidak|silakan|data|layanan|akses|permintaan|server|coba|wajib|sudah|harus)\b/i.test(value)) return value;
  return fallback;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return toIndonesianErrorMessage(error instanceof Error ? error.message : undefined, fallback);
}
