import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import Carrinho from "../models/Carrinho";
import CarrinhoService from "../services/CarrinhoService";
import { useNavigate } from "react-router-dom";
import { Empresa } from "../models/Empresa";
import EmpresaService from "../services/EmpresaService";

function Carrinhos() {
    const [carrinhos, setCarrinhos] = useState<Carrinho[]>([]);
    const carrinhoService = new CarrinhoService();
    const [empresa, setEmpresa] = useState<Empresa>();
    const empresaService = new EmpresaService();

    const navigate = useNavigate();

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('id');        

        if (id === null) {
            navigate("/");
        }
        const empresaId = parseInt(id || '');

        empresaService.getEmpresa(empresaId).then(empresa => setEmpresa(empresa));
        carrinhoService.getCarrinhos(empresaId).then(carrinhos => setCarrinhos(carrinhos));
    }, []);

    const handleCreateCarrinho = async () => {
        const newCarrinho: Carrinho = { id: 0, empresaId: 0, notasFiscais: null, checkout: undefined};
        const createdCarrinho = await carrinhoService.createCarrinho(empresa.id);
        setCarrinhos([...carrinhos, createdCarrinho]);
    };

    return (
        <Container>
            <h1>Carrinhos</h1>
            <Button className="my-3" variant="success" onClick={handleCreateCarrinho}>Novo Carrinho</Button>
            {
                carrinhos.length === 0 ? <></> :
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Notas</th>
                            <th>Valor</th>
                            <th>Checkout Realizado</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrinhos.map(carrinho => (
                            <tr key={carrinho.id}>
                                <td>{carrinho.id}</td>
                                <td>{carrinho.notasFiscais ? carrinho.notasFiscais.length : 0}</td>
                                <td>R$ 
                                    {
                                        carrinho.notasFiscais ? 
                                        carrinho.notasFiscais.reduce((acc, nota) => acc + nota.valor, 0) : 0
                                    }
                                </td>
                                <td>{carrinho.checkout ? 'SIM' : 'NÃO'}</td>
                                <td>
                                    <Button variant="primary" onClick={() => navigate(`/carrinho/notasfiscais?id=${carrinho.id}&empresaId=${empresa.id}`)}>Ver</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            }
        </Container>
    );
}

export default Carrinhos;