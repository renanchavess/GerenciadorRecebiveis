import NotaFiscal from "../models/NotaFiscal";

export default class NotaFiscalService {

    private URL_BASE = 'https://localhost:7199/api/';

    async getNotasFiscais(empresaId: number): Promise<NotaFiscal[]> {
        const response = await fetch(this.URL_BASE + `NotaFiscal/empresa/${empresaId}`)
            .then(response => response.json())

        const notasFiscais: NotaFiscal[] = response.map((notaFiscal: any) => {
            return new NotaFiscal(
                notaFiscal.id, 
                notaFiscal.numero, 
                notaFiscal.valor, 
                new Date(notaFiscal.data_vencimento), 
                notaFiscal.empresa_id,
                notaFiscal.carrinho_id)
        });

        return notasFiscais;
    }

    async createNotaFiscal(notaFiscal: NotaFiscal) {
        return fetch(this.URL_BASE + 'NotaFiscal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numero: notaFiscal.numero,
                valor: notaFiscal.valor,
                data_vencimento: notaFiscal.data.toISOString().split('T')[0],
                empresa_id: notaFiscal.empresaId
            })
        })
            .then(response => response.json())
    }
}