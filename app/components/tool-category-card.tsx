import { LocaleLink } from "./locale-link";

interface ToolCategoryCardProps {
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
  link: string;
  badge?: string;
}

export function ToolCategoryCard({
  title,
  description,
  count,
  icon,
  link,
  badge = "Available",
}: ToolCategoryCardProps) {
  return (
    <div className="relative isolate h-full w-full">
      <LocaleLink to={link} className="block h-full w-full">
        <figure
          className="relative flex h-full w-full flex-col justify-between border border-border p-4 sm:p-6 text-sm hover:border-foreground/20 transition-all duration-200 group cursor-pointer bg-white dark:bg-white/5 border-gray-200 dark:border-white/10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255, 107, 53, 0.082) 8px, rgba(255, 107, 53, 0.082) 9px)",
          }}
        >
          {/* Corner Markers */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-gray-200 dark:bg-white/20 transition-colors group-hover:bg-blue-500"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-gray-200 dark:bg-white/20 transition-colors group-hover:bg-blue-500"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-gray-200 dark:bg-white/20 transition-colors group-hover:bg-blue-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-gray-200 dark:bg-white/20 transition-colors group-hover:bg-blue-500"></div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center w-10 h-10 rounded-none text-gray-900 dark:text-white">
                {icon}
              </div>
              <span
                data-slot="badge"
                className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 text-xs border-transparent bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
              >
                {badge}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="my-2 h-[1px] w-full bg-gray-100 dark:bg-white/10"></div>
            <div className="flex items-center justify-between">
              <span
                data-slot="badge"
                className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 text-xs text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors"
              >
                Category
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {count} elements
                </span>
              </div>
            </div>
          </div>
        </figure>
      </LocaleLink>
    </div>
  );
}
