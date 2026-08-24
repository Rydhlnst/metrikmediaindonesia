import { getArticles } from "@/lib/queries";
import { Lightning } from "@phosphor-icons/react/dist/ssr";

export async function BreakingNewsTicker() {
  let items: string[] = [];
  try {
    items = (await getArticles({ breaking: true, limit: 8 })).map((article) => article.title);
  } catch (error) {
    console.error("Breaking news ticker failed to load", error);
  }
  if (!items.length) return null;
  return (
    <div className="w-full bg-white border-b border-black/10 py-2">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex items-center gap-3">
        {/* Kuning Emas Breaking Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-gold text-white font-bold text-[10px] uppercase tracking-wider shrink-0">
          <Lightning className="size-3.5 fill-current" weight="fill" />
          <span>BREAKING</span>
        </div>

        {/* Seamless Infinite Ticker */}
        <div className="ticker-wrap flex-1 overflow-hidden min-w-0">
          <div className="ticker-content text-xs font-semibold uppercase text-foreground tracking-wide flex items-center">
            {/* Track 1 */}
            <div className="flex shrink-0 items-center">
              {items.map((item, index) => (
                <span key={`t1-${index}`} className="ticker-item inline-flex items-center whitespace-nowrap">
                  {item}
                  <span className="mx-3 text-black/25 font-bold">•</span>
                </span>
              ))}
            </div>
            {/* Track 2 (Seamless loop clone) */}
            <div className="flex shrink-0 items-center" aria-hidden="true">
              {items.map((item, index) => (
                <span key={`t2-${index}`} className="ticker-item inline-flex items-center whitespace-nowrap">
                  {item}
                  <span className="mx-3 text-black/25 font-bold">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
