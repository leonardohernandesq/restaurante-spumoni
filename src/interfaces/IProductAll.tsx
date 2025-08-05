export interface IProductAll {
    id: string,
    category: string,
    slug?: string,
    descriptionCategory: string,
    products: IProduct[]
}

export interface IProduct {
    image_url: string;
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
        atributo_id?: number;
        limite: null;
        obrigatorio: boolean | string | number;
        nome_atributo: string;
        valores_atributo: {
            valor_atributo_id?: number;
            valor: string;
            preco: string;
            preco_incluido: boolean;
        }[];
    }[];
    dias_disponiveis: number[];
}

