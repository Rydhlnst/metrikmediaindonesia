import Link from "next/link";
import { getActiveAdvertisements } from "@/lib/advertising";
import { AdvertisementImpression } from "@/components/advertising/advertisement-impression";
import { MediaImage } from "@/components/shared/media-image";

export async function AdvertisementSlot({ position, className }: { position: string; className?: string }) {
  const advertisements = await getActiveAdvertisements(position);
  if (advertisements.length === 0) return null;

  return (
    <aside className={className} aria-label="Advertisement">
      {advertisements.map((advertisement) => (
        <div key={advertisement.id}>
          <AdvertisementImpression id={advertisement.id} />
          <Link href={`/go/${advertisement.id}`} className="group block border border-black/10 bg-white" rel="sponsored noopener" target="_blank">
          {advertisement.image || advertisement.desktopImage || advertisement.mobileImage ? <div className="relative aspect-[16/5] overflow-hidden bg-muted"><picture><source media="(max-width: 767px)" srcSet={advertisement.mobileImage || advertisement.image || advertisement.desktopImage || undefined} /><MediaImage src={advertisement.desktopImage || advertisement.image || advertisement.mobileImage} alt={advertisement.title} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" /></picture></div> : <p className="p-4 text-center text-xs font-semibold text-muted-foreground">{advertisement.title}</p>}
          <span className="block border-t border-black/5 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Advertisement</span>
          </Link>
        </div>
      ))}
    </aside>
  );
}
