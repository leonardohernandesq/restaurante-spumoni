export interface IProductAll {
    id: string,
    category: string,
    descriptionCategory: string,
    products: IProduct[]
}

export interface IProduct {
    image_url: any;
    id: number;
    name: string;
    slug: string;
    descricao?: string;
    description?: string;
    image: string;
    preco?: string | number;
    price?: string | number;
    categoria_id: number;
    ativo: boolean;
    atributos: {
        nome_atributo: string;
        valores_atributo: {
            valor: string;
            preco: string;
            preco_incluido: boolean;
        }[];
    }[];
    dias_disponiveis: number[];
}

