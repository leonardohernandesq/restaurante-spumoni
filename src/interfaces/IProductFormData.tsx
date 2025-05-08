export interface IValorAtributo {
    valor: string;
    preco: string;
    preco_incluido: boolean;
}

export interface IAtributo {
    nomes_atributos: string;
    valores_atributo: IValorAtributo[];
}

export interface IProductFormData {
    nome: string;
    slug: string;
    descricao: string;
    preco: string;
    categoria_id: string | number;
    ativo: boolean;

    image: File | null;
    imageUrl?: string | null;

    atributos: IAtributo[];
    diasDisponiveis: boolean[];
}

