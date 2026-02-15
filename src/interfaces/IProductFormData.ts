export interface IValorAtributo {
    valor_atributo_id?: string | number | null;
    valor: string;
    preco: string;
    preco_incluido: boolean;
}

export interface IAtributo {
    atributo_id?: string | number | null;
    limite?: null;
    obrigatorio: boolean;
    nomes_atributos: string;
    valores_atributo: IValorAtributo[];
}

export interface IProductFormData {
    id?: string | number | null;
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

