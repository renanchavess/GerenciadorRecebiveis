import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import { Empresa as EmpresaModel, getRamoName, Ramo } from "../models/Empresa";
import { use, useEffect, useState } from "react";
import EmpresaService from "../services/EmpresaService";
import { useNavigate } from "react-router-dom";

function Empresas() {

    const [empresas, setEmpresas] = useState<EmpresaModel[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newEmpresa, setNewEmpresa] = useState<EmpresaModel>({ id: 0, nome: '', cnpj: '', faturamento: 0, ramo: Ramo.Servico });
    const navigate = useNavigate();

    useEffect(() => {
        const empresaService = new EmpresaService();
        empresaService.getEmpresas().then(empresas => setEmpresas(empresas));
    }, []);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEmpresa({ ...newEmpresa, [name]: value });
    };

    const handleRamoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmpresa({ ...newEmpresa, ramo: parseInt(e.target.value)});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const createdEmpresa = await new EmpresaService().createEmpresa(newEmpresa);
        setEmpresas([...empresas, createdEmpresa]);
        handleCloseModal();
    };
            
    return (
        <Container>
            <h1>Empresas</h1>
            <Button className="my-3" variant="success" onClick={handleShowModal}>Cadastro</Button>
            {
                empresas.length === 0 ? <></> :
                <div className="table-overflow">
                    <Table striped bordered hover className="table-fixed">
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>CNPJ</th>
                            <th>Faturamento</th>
                            <th>Ramo</th>
                            <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            empresas.map(empresa => {
                                return (
                                    <tr key={empresa.id}>
                                        <td>{empresa.id}</td>
                                        <td>{empresa.nome}</td>
                                        <td>{empresa.cnpj}</td>
                                        <td>R$ {empresa.faturamento}</td>
                                        <td>{getRamoName(empresa.ramo)}</td>
                                        <td>
                                            <Button
                                                onClick={() => navigate(`/notafiscal?id=${empresa.id}`)}
                                                variant="primary" 
                                                className="m-2 btn-sm btn-table-action">
                                                NFs
                                            </Button>
                                            <Button
                                                onClick={() => navigate(`/carrinho?id=${empresa.id}`)}
                                                variant="dark"
                                                className="m-2 btn-sm btn-table-action">
                                                Carrinhos
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </Table>
                </div>
                
            }

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastro de Empresa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNome">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                value={newEmpresa.nome}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formCnpj" className="mt-3">
                            <Form.Label>CNPJ</Form.Label>
                            <Form.Control
                                type="text"
                                name="cnpj"
                                value={newEmpresa.cnpj}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formFaturamento" className="mt-3">
                            <Form.Label>Faturamento</Form.Label>
                            <Form.Control
                                type="number"
                                name="faturamento"
                                value={newEmpresa.faturamento}
                                onChange={handleInputChange}
                        />
                        </Form.Group>
                        <Form.Group controlId="formRamo" className="mt-3">
                            <Form.Label className="mx-3">Ramo: </Form.Label>
                            <Form.Check
                                inline
                                key={Ramo.Produto}
                                type="radio"
                                name="ramo"
                                value={Ramo.Produto}
                                label={getRamoName(Ramo.Produto)}
                                checked={newEmpresa.ramo === Ramo.Produto}                                
                                onChange={handleRamoChange}
                                required
                            />
                            <Form.Check
                                inline
                                key={Ramo.Servico}
                                type="radio"
                                name="ramo"
                                value={Ramo.Servico}
                                label={getRamoName(Ramo.Servico)}
                                checked={newEmpresa.ramo === Ramo.Produto}                                
                                onChange={handleRamoChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Salvar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            
        </Container>
    );
}

export default Empresas;