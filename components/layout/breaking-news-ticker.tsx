import { BREAKING_NEWS } from "@/lib/constants";
import { Lightning } from "@phosphor-icons/react/dist/ssr";

export function BreakingNewsTicker() {
  return (
    <div className="w-full bg-surface-container-lowest border-b border-black/10 py-2 shadow-2xs">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex items-center gap-3">
        {/* Kuning Emas Breaking Badge */}
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#B8860B] text-white font-bold text-[10px] uppercase tracking-wider shrink-0 shadow-2xs">
          <Lightning className="size-3.5 fill-current animate-bounce" />
          <span>BREAKING</span>
        </div>

        {/* Ticker Text Content */}
        <div className="ticker-wrap flex-1 overflow-hidden min-w-0">
          <div className="ticker text-xs font-semibold uppercase text-on-surface tracking-wide flex items-center">
            {BREAKING_NEWS.map((item, index) => (
              <span key={index} className="ticker-item inline-flex items-center whitespace-nowrap">
                {item}
                {index < BREAKING_NEWS.length - 1 && (
                  <span className="mx-3 text-black/20">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
