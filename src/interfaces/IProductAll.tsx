export interface IProductAll {
    id: string,
    category: string,
    descriptionCategory: string,
    products: IProduct[]
}

export interface IProduct {
    id: string,
    name: string,
    slug: string,
    description: string,
    image: string,
    price: string
}