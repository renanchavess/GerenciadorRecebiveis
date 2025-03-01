export default class NotaFiscal {

    public id: number;
    public numero: number;
    public valor: number;
    public data: Date;
    public empresaId: number;
    public carrinhoId: number | undefined;

    constructor(id: number, numero: number, valor: number, data: Date, empresaId: number, carrinhoId?: number) {
        this.id = id;
        this.numero = numero;
        this.valor = valor;
        this.data = data;
        this.empresaId = empresaId;
        this.carrinhoId = carrinhoId;
    }

}	