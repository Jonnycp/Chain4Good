import { Icon } from "@iconify/react";
import CardHome, { CardHomeSkeleton } from "./CardHome";
import type { Project } from "../context/AppProvider";

export default function ProjectsGrid({
  title,
  titleRight,
  projects,
  loading,
  skeletonCount = 3,
  emptyIcon = "solar:box-minimalistic-linear",
  emptyText = "Nessun progetto trovato.",
  categories,
  selectedCategory,
  setCategory,
}: {
  title: string;
    titleRight?: React.ReactNode;
  projects: Array<Project>;
  loading: boolean;
  skeletonCount?: number;
  emptyIcon?: string;
  emptyText?: string | React.ReactNode;
  categories?: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  selectedCategory?: string | null;
  setCategory?: (cat: string) => void;
}) {
  return (
    <div className="mb-8">
      {titleRight ? <div className="flex items-center justify-between pr-10">
        <h2 className="px-6 text-xl font-bold text-secondary mb-4 md:mb-6 md:px-12">
          {title}
        </h2>
        {!loading && projects.length > 0 && titleRight}
        </div> :
      (
        <h2 className="px-6 text-xl font-bold text-secondary mb-4 md:mb-6 md:px-12">
          {title}
        </h2>
      )}
      {categories &&
        selectedCategory &&
        setCategory &&
        categories.length > 0 && (
          <div
            className="
                    flex overflow-x-auto px-6 gap-3 pb-4 no-scrollbar
                    md:px-12 md:flex-wrap
                "
            style={{ scrollbarWidth: "none" }}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap font-bold text-sm transition-all border
                                    ${
                                      isActive
                                        ? "bg-primary text-white shadow-lg shadow-green-500/30 border-transparent"
                                        : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                                    }
                                `}
                >
                  <Icon icon={cat.icon} className="text-lg" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}
      <div
        className={!loading && projects.length > 0 ? "flex overflow-x-auto px-6 pb-6 gap-5 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:px-12 md:overflow-visible" : "px-6 pb-6"}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {!loading ? (
          projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                className="min-w-[85vw] sm:min-w-[320px] snap-center md:min-w-0 cursor-pointer"
              >
                <CardHome {...project} />
              </div>
            ))
          ) : (
            typeof emptyText === "string" ? (
              <div className="px-6 py-12 text-center md:bg-white md:mx-12 md:rounded-3xl">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon icon={emptyIcon} className="text-3xl text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm font-medium">{emptyText}</p>
              </div>
            ) : (
              emptyText
            )
          )
        ) : (
          Array.from({ length: skeletonCount }).map((_, index) => (
            <div
              key={"skeleton-" + index}
              className="min-w-[85vw] sm:min-w-[320px] snap-center md:min-w-0"
            >
              <CardHomeSkeleton />
            </div>
          ))
        )}
      </div>
    </div>
  );
}