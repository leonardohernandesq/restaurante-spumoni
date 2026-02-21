"use client";

import { useState } from "react";
import Link from "next/link";
import { IPropsCategory } from "@/interfaces/ICategory";
import { SkeletonComponent } from "./SkeletonComponent";

export const CategoryScroll = ({ categories, isLoading }: IPropsCategory) => {
  const [linkActive, setLinkActive] = useState(0);

  const handleScrollLink = (item: number) => {
    setLinkActive(item);
  };

  const sortedData = [...categories].sort((a, b) => {
    if (a.nome === "Pratos do Dia") return -1;
    if (b.nome === "Pratos do Dia") return 1;
    return 0;
  });

  if (isLoading) {
    return categoryScrollSkeleton();
  }

  return (
    <div className="block overflow-x-auto pt-3 pb-4 px-2 bg-zinc-100 mt-[-20] md:mt-0 z-30 sticky top-0 rounded-t-2xl">
      <div className="xl:max-w-7xl xl:mx-auto">
        <div className="flex gap-4 w-max">
          {sortedData.map(
            (category, index) =>
              category &&
              category.total_produtos! > 0 && (
                <Link
                  key={category.id}
                  onClick={() => handleScrollLink(index)}
                  href={`#${category.slug}`}
                  title={category.descricao}
                  className={`${
                    linkActive === index ? "text-black" : "text-zinc-400"
                  }`}
                >
                  {category.nome}
                  {linkActive === index && (
                    <div className="h-[2px] w-full bg-purple-principal-500"></div>
                  )}
                </Link>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

const categoryScrollSkeleton = () => {
  return (
    <div className="block overflow-x-auto pt-3 pb-4 px-2 bg-zinc-100 mt-[-20] md:mt-0 z-30 sticky top-0 rounded-t-2xl">
      <div className="xl:max-w-7xl xl:mx-auto">
        <div className="flex gap-4 w-max">
          {[...Array(5)].map((_, index) => (
            <SkeletonComponent key={index} height={24} width={100} />
          ))}
        </div>
      </div>
    </div>
  );
};
