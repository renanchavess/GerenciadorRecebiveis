import Carrinho from "../models/Carrinho";
import NotaFiscal from "../models/NotaFiscal";

export default class CarrinhoService {
    
    private URL_BASE = 'https://localhost:7199/api/';

    async getCarrinhos(empresaId: number): Promise<Carrinho[]> {
        const response = await fetch(this.URL_BASE + `carrinho/empresa/${empresaId}`)
            .then(response => response.json())

        const carrinhos: Carrinho[] = response.map((carrinho: any) => {
            let notasFiscais: NotaFiscal[] | null = null;
            
            if (carrinho.notas_fiscais) {
                notasFiscais = carrinho.notas_fiscais.map((notaFiscal: any) => {
                    return new NotaFiscal(notaFiscal.id, notaFiscal.numero, notaFiscal.valor, new Date(notaFiscal.data), notaFiscal.empresa_id, notaFiscal.carrinho_id)
                });
            }

            return new Carrinho(carrinho.id, carrinho.empresa_id, notasFiscais, carrinho.checkout)
        });        

        console.log(carrinhos);
        return carrinhos;
    }

    async getCarrinho(id: number): Promise<Carrinho> {
        const response = await fetch(this.URL_BASE + `carrinho/${id}`)
            .then(response => response.json())

        let notasFiscais: NotaFiscal[] | null = null;
        
        if (response.notas_fiscais) {
            notasFiscais = response.notas_fiscais.map((notaFiscal: any) => {
                return new NotaFiscal(notaFiscal.id, notaFiscal.numero, notaFiscal.valor, new Date(notaFiscal.data), notaFiscal.empresa_id, notaFiscal.carrinho_id)
            });
        }

        const carrinho = new Carrinho(response.id, response.empresa_id, notasFiscais, response.checkout ? true : false);
        return carrinho;
    }

    async createCarrinho(empresaId: number) {
        return fetch(this.URL_BASE + 'Carrinho?empresaId=' + empresaId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: empresaId
            })
        })
            .then(response => response.json())
    }

    async checkoutCarrinho(carrinhoId: number) {
        return await fetch(this.URL_BASE + `carrinho/${carrinhoId}/checkout`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        })            
    }

    async adicionarNotaFiscal(carrinhoId: number, notaFiscalId: number) {
        await fetch(this.URL_BASE + `carrinho/${carrinhoId}/adicionarNotaFiscal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: notaFiscalId
            })
        })
    }

    async removeNotaFiscal(carrinhoId: number, notaFiscalId: number) {
        await fetch(this.URL_BASE + `carrinho/${carrinhoId}/removerNotaFiscal`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: notaFiscalId
            })
        })
    }
}