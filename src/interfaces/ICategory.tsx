export interface ICategory {
    id: number;
    nome: string;
    slug: string;
    descricao: string;
}

export interface IPropsCategory {
    categories: ICategory[];
}