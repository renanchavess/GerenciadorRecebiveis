
import { Empresa } from '../models/Empresa';

class EmpresaService {

    private URL_BASE = 'https://localhost:7199/api/';

    async getEmpresas(): Promise<Empresa[]> {
        const response = await fetch('https://localhost:7199/api/Empresa')
            .then(response => response.json())

        const empresas: Empresa[] = response.map((empresa: any) => {
            return new Empresa(empresa.id, empresa.nome, empresa.cnpj, empresa.ramo, empresa.faturamento,)
        });

        return empresas;
    }

    async getEmpresa(id: number): Promise<Empresa> {
        const response = await fetch(this.URL_BASE+`empresa/${id}`)
            .then(response => response.json())
        
        return new Empresa(response.id, response.nome, response.cnpj, response.ramo)
    }

    async createEmpresa(empresa: Empresa) {
        return fetch(this.URL_BASE + 'empresa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: empresa.nome,
                cnpj: empresa.cnpj,
                ramo: empresa.ramo,
                faturamento: empresa.faturamento
            })
        })
    }    
}

export default EmpresaService;