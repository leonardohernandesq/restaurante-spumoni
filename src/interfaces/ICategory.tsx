export interface ICategory {
    id: number;
    nome: string;
    slug: string;
    descricao: string;
    total_produtos?: number;
}

export interface IPropsCategory {
    categories: ICategory[];
}