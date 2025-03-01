import NotaFiscal from "./NotaFiscal";

export default class Carrinho {
    public id: number;
    public empresaId: number;
    public notasFiscais: NotaFiscal[] | null;
    public checkout: boolean;

    constructor(
        id: number, 
        empresaId:number, 
        notasFiscais: NotaFiscal[] | null = null, 
        checkout: boolean ) 
    {
        this.id = id;
        this.empresaId = empresaId;
        this.notasFiscais = notasFiscais;
        this.checkout = checkout;
    }
}