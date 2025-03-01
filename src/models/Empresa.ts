
export class Empresa {
    public id: number | undefined;
    public nome: string;
    public cnpj: string;
    public faturamento: number | undefined;
    public ramo: Ramo;

    constructor(id: number, nome: string, cnpj: string, ramo: Ramo, faturamento?: number) {
        this.id = id;
        this.nome = nome;
        this.cnpj = cnpj;
        this.faturamento = faturamento;
        this.ramo = ramo;
    }
}

export enum Ramo {
    Servico = 1,
    Produto = 2
}

export function getRamoName(ramo: Ramo): string {
    switch (ramo) {
        case Ramo.Servico:
            return "Serviço";
        case Ramo.Produto:
            return "Produto";
        default:
            return "";
    }
}