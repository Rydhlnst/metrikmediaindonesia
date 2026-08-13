import { BREAKING_NEWS } from "@/lib/constants";

export function BreakingNewsTicker() {
  return (
    <div className="w-full bg-surface-container-low border-b border-outline-variant py-2">
      <div className="container-editorial flex items-center">
        <span className="font-label-md text-label-md uppercase text-error font-bold mr-4 flex-shrink-0">
          BREAKING
        </span>
        <div className="ticker-wrap flex-grow">
          <div className="ticker font-label-md text-label-md uppercase text-on-surface-variant">
            {BREAKING_NEWS.map((item, index) => (
              <span key={index} className="ticker-item">
                {item}
                {index < BREAKING_NEWS.length - 1 && (
                  <span className="mx-4 text-outline-variant">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
