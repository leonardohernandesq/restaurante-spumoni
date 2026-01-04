import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/Container";

import { IProductSectionProps } from "@/interfaces/IProductSectionProps";
import { SkeletonComponent } from "./SkeletonComponent";

export const ProductSection = ({ data, isLoading }: IProductSectionProps) => {
  if (isLoading) {
    return <ProductSectionSkeleton />;
  }

  return (
    <>
      {data.map((item) => {
        if (item.products.length === 0) return null;

        return (
          <Container key={item.id}>
            <section id={item.slug} className="pt-6 pb-12">
              <div className="text-center pb-6">
                <h2 className="font-medium text-3xl mb-3">{item.category}</h2>
                <p className="text-zinc-700 max-w-4xl m-auto">
                  {item.descriptionCategory}
                </p>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2">
                {item.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </Container>
        );
      })}
    </>
  );
};

export const ProductSectionSkeleton = () => {
  return (
    <>
      <Container>
        <section className="pt-6 pb-12">
          <div className="text-center pb-6 items-center flex flex-col gap-4">
            <SkeletonComponent height={36} width={300} />
            <SkeletonComponent height={72} width={500} />
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2">
            <SkeletonComponent height={384} width={"100%"} />
            <SkeletonComponent height={384} width={"100%"} />
            <SkeletonComponent height={384} width={"100%"} />
          </div>
        </section>
      </Container>
    </>
  );
};
