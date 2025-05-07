export interface IProductAll {
    id: string,
    category: string,
    descriptionCategory: string,
    products: IProduct[]
}

export interface IProduct {
    id: number;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    price: string | number;
    categoria_id: number;
    ativo: number;
}
