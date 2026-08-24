/**
 * Milestone Email Templates for Metrik Media Indonesia Authors
 * Editorial Style: Sharp borders (rounded-none), Gold & Slate Palette, No Emojis, Clean Vector Badges
 */

export interface MilestoneEmailData {
  authorName: string;
  authorEmail: string;
  authorSlug: string;
  milestoneType: "3_months" | "6_months" | "1_year" | "2_years" | "annual";
  joinedDateFormatted: string;
  totalArticles: number;
  totalViews: number;
  appUrl?: string;
}

export function getMilestoneEmailContent(data: MilestoneEmailData): {
  subject: string;
  badgeTitle: string;
  headline: string;
  introMessage: string;
  html: string;
} {
  const appUrl = data.appUrl || process.env.NEXT_PUBLIC_APP_URL || "https://metrikmediaindonesia.id";
  const authorProfileUrl = `${appUrl}/author/${data.authorSlug}`;
  const writeArticleUrl = `${appUrl}/dashboard/articles/new`;

  let badgeTitle = "3 BULAN BERKARYA";
  let headline = "Penghargaan atas 3 Bulan Dedikasi Jurnalistik Anda";
  let introMessage =
    "Terima kasih telah memperkaya literasi dan informasi publik melalui karya tulis yang kredibel di Metrik Media Indonesia. Satu triwulan pertama telah terlewati dengan kontribusi yang bernilai tinggi.";
  let subject = `Apresiasi 3 Bulan Berkarya di Metrik Media Indonesia: ${data.authorName}`;

  if (data.milestoneType === "6_months") {
    badgeTitle = "6 BULAN DEDIKASI";
    headline = "Setengah Tahun Konsistensi Memberikan Wawasan Terpercaya";
    introMessage =
      "Enam bulan perjalanan jurnalistik Anda telah menjangkau ribuan pembaca setia di seluruh nusantara. Kami mengapresiasi tinggi integritas, ketelitian, dan sudut pandang tajam dalam setiap liputan yang Anda hadirkan.";
    subject = `Apresiasi 6 Bulan Dedikasi Jurnalistik: ${data.authorName}`;
  } else if (data.milestoneType === "1_year") {
    badgeTitle = "1 TAHUN ANNIVERSARY";
    headline = "Satu Tahun Mengawal Literasi & Informasi Berkualitas";
    introMessage =
      "Tepat satu tahun yang lalu Anda bergabung menjadi bagian dari ruang redaksi Metrik Media Indonesia. Dedikasi berkelanjutan Anda adalah pilar penting bagi jurnalisme independen dan profesional.";
    subject = `Peringatan 1 Tahun Dedikasi Jurnalistik Metrik Media: ${data.authorName}`;
  } else if (data.milestoneType === "2_years" || data.milestoneType === "annual") {
    badgeTitle = "PENULIS KEHORMATAN";
    headline = "Apresiasi Kehormatan atas Kontribusi Berkelanjutan";
    introMessage =
      "Jejak karya dan ketajaman liputan Anda selama bertahun-tahun telah mengukuhkan posisi Metrik Media Indonesia sebagai sumber rujukan utama berita nasional.";
    subject = `Penghargaan Kehormatan Kontributor Redaksi: ${data.authorName}`;
  }

  const formattedViews = new Intl.NumberFormat("id-ID").format(data.totalViews);
  const formattedArticles = new Intl.NumberFormat("id-ID").format(data.totalArticles);

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    * {
      border-radius: 0px !important;
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f3f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1a1c1a;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f3f0;
      padding: 40px 16px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #1a1c1a;
      border-top: 4px solid #b8860b;
    }
    .header {
      background-color: #111827;
      padding: 32px 28px;
      text-align: center;
      border-bottom: 1px solid #374151;
    }
    .brand-title {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #ffffff;
      text-transform: uppercase;
      margin: 0 0 4px 0;
    }
    .brand-tagline {
      font-size: 10px;
      color: #b8860b;
      letter-spacing: 3px;
      text-transform: uppercase;
      font-weight: 700;
    }
    .badge-wrapper {
      margin-top: 18px;
      text-align: center;
    }
    .badge-pill {
      display: inline-block;
      background-color: #b8860b;
      color: #ffffff;
      font-size: 10px;
      font-weight: 800;
      padding: 5px 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      border: 1px solid #92700a;
    }
    .content {
      padding: 36px 32px;
    }
    .kicker {
      font-size: 11px;
      font-weight: 800;
      color: #b8860b;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .headline {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      line-height: 1.3;
      margin: 0 0 16px 0;
      letter-spacing: -0.3px;
    }
    .intro {
      font-size: 14px;
      line-height: 1.7;
      color: #374151;
      margin-bottom: 28px;
    }
    .stats-panel {
      background-color: #fcfbf9;
      border: 1px solid #e5e7eb;
      border-left: 3px solid #b8860b;
      padding: 20px;
      margin-bottom: 28px;
    }
    .stats-header {
      font-size: 11px;
      font-weight: 800;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    .stats-table {
      width: 100%;
      border-collapse: collapse;
    }
    .stat-cell {
      width: 50%;
      text-align: center;
      padding: 8px;
    }
    .stat-cell:first-child {
      border-right: 1px solid #e5e7eb;
    }
    .stat-value {
      font-family: 'Courier New', Courier, monospace;
      font-size: 28px;
      font-weight: 800;
      color: #111827;
      line-height: 1;
      margin-bottom: 6px;
    }
    .stat-label {
      font-size: 11px;
      font-weight: 700;
      color: #b8860b;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .join-info {
      text-align: center;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #6b7280;
    }
    .actions-box {
      text-align: center;
      margin: 32px 0 16px 0;
    }
    .btn-gold {
      display: inline-block;
      background-color: #b8860b;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 12px;
      font-weight: 800;
      padding: 13px 32px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border: 1px solid #92700a;
    }
    .btn-link {
      display: inline-block;
      margin-top: 14px;
      color: #6b7280 !important;
      text-decoration: underline;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .footer {
      background-color: #111827;
      padding: 24px 32px;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
      border-top: 1px solid #374151;
      line-height: 1.6;
    }
    .footer a {
      color: #b8860b;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="brand-title">Metrik Media Indonesia</div>
        <div class="brand-tagline">Portal Berita Digital Tepercaya</div>
        <div class="badge-wrapper">
          <span class="badge-pill">${badgeTitle}</span>
        </div>
      </div>

      <div class="content">
        <div class="kicker">Yth. ${data.authorName}</div>
        <h1 class="headline">${headline}</h1>
        <p class="intro">
          ${introMessage}
        </p>

        <div class="stats-panel">
          <div class="stats-header">Rekam Jejak Kontribusi Penulis</div>
          <table class="stats-table">
            <tr>
              <td class="stat-cell">
                <div class="stat-value">${formattedArticles}</div>
                <div class="stat-label">Berita Diterbitkan</div>
              </td>
              <td class="stat-cell">
                <div class="stat-value">${formattedViews}</div>
                <div class="stat-label">Total Pembaca</div>
              </td>
            </tr>
          </table>
          <div class="join-info">
            Masa Dedikasi Aktif Sejak: <strong>${data.joinedDateFormatted}</strong>
          </div>
        </div>

        <p style="font-size: 13px; color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
          Setiap naskah yang Anda kirimkan melewati proses kurasi editorial berstandar jurnalisme presisi. Kami mengajak Anda untuk terus memproduksi konten yang mengedukasi dan menginspirasi publik.
        </p>

        <div class="actions-box">
          <a href="${writeArticleUrl}" class="btn-gold">Tulis Berita Baru</a>
          <br />
          <a href="${authorProfileUrl}" class="btn-link">Kunjungi Halaman Profil Publik Penulis</a>
        </div>
      </div>

      <div class="footer">
        <p style="margin: 0 0 8px 0;">
          Pemberitahuan resmi dari Dewan Editorial <strong>PT Metrik Media Indonesia</strong>.
        </p>
        <p style="margin: 0;">
          <a href="${appUrl}">Beranda</a> • <a href="${appUrl}/tentang-kami">Pedoman Media Siber</a> • <a href="${appUrl}/dashboard">Dashboard Redaksi</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  return {
    subject,
    badgeTitle,
    headline,
    introMessage,
    html,
  };
}
