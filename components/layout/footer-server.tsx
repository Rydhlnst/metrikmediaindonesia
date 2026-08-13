import Link from "next/link";
import { BrandName } from "@/components/shared/brand-name";
import { NAVIGATION } from "@/lib/constants";

const footerLinks = [
  ...NAVIGATION.footer.perusahaan,
  { label: "Arsip", href: "/pencarian" },
  { label: "Berlangganan", href: "/signup" },
];

export function FooterServer() {
  return (
    <footer className="w-full mt-[80px] bg-surface-container-low border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] max-w-[1280px] mx-auto px-4 md:px-16 py-12">
        {/* Brand + Copyright */}
        <div className="md:col-span-4 mb-8 md:mb-0 flex flex-col gap-6">
          <Link href="/">
            <BrandName size="md" />
          </Link>
          <p className="font-body-md text-body-md text-on-surface">
            &copy; {new Date().getFullYear()} METRIK MEDIA INDONESIA. Intellectual clarity for the modern intelligentsia.
          </p>
        </div>

        {/* Links */}
        <div className="md:col-span-8 flex flex-col md:flex-row md:flex-nowrap justify-end gap-6 md:gap-12">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all opacity-80 hover:opacity-100 uppercase tracking-widest"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
