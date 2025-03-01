import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { Empresa as EmpresaModel, Ramo } from "../models/Empresa";
import { useEffect, useState } from "react";
import EmpresaService from "../services/EmpresaService";
import { useNavigate } from "react-router-dom";
import NotaFiscalService from "../services/NotaFiscalService";
import NotaFiscal from "../models/NotaFiscal";

function NotasFiscais() {
    const [empresa, setEmpresa] = useState<EmpresaModel>();
    const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newNotaFiscal, setNewNotaFiscal] = useState<NotaFiscal>({id: 0, numero: 0, valor: 0, data: new Date(), empresaId: 0, carrinhoId: undefined });
    const notaFiscalService = new NotaFiscalService();
    const empresaService = new EmpresaService();

    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const empresaId = queryParams.get('id');

        if (empresaId === null) {
            navigate("/");
        }

        empresaService.getEmpresa(1).then(empresa => setEmpresa(empresa));
        notaFiscalService.getNotasFiscais(1).then(notasFiscais => setNotasFiscais(notasFiscais));
    }, []);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (type === 'date') {
            setNewNotaFiscal({ ...newNotaFiscal, [name]: new Date(value) });
            return;
        }
        setNewNotaFiscal({ ...newNotaFiscal, [name]: name === 'numero' ? Number(value) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await new NotaFiscalService().createNotaFiscal(newNotaFiscal);        
        handleCloseModal();
        notaFiscalService.getNotasFiscais(1).then(notasFiscais => setNotasFiscais(notasFiscais));
    };

    return (
        empresa?.id === undefined ? <></> :
        <Container>
            <h1>NFs - {empresa.nome}</h1>
            <hr />

            <Button variant="success" className="my-3" onClick={handleShowModal}>Registrar nova NF</Button>
            <Row>
                <Col sm={12}>
                    <h3>NFs</h3>
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Número</th>
                                    <th>Valor</th>
                                    <th>Data</th>
                                    <th>Empresa</th>
                                    <th>Carrinho</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    notasFiscais.map(notaFiscal => {
                                        return (
                                            <tr key={notaFiscal.id}>
                                                <td>{notaFiscal.id}</td>
                                                <td>{notaFiscal.numero}</td>
                                                <td>R$ {notaFiscal.valor}</td>
                                                <td>{notaFiscal.data.toLocaleDateString()}</td>
                                                <td>{notaFiscal.empresaId}</td>
                                                <td>{notaFiscal.carrinhoId}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                </Col>                
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastro de Nota Fiscal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNumero">
                            <Form.Label>Número</Form.Label>
                            <Form.Control
                                type="text"
                                name="numero"
                                value={newNotaFiscal.numero}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formValor">
                            <Form.Label>Valor</Form.Label>
                            <Form.Control
                                type="text"
                                name="valor"
                                value={newNotaFiscal.valor}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formData">
                            <Form.Label>Data</Form.Label>
                            <Form.Control
                                type="date"
                                name="data"
                                value={newNotaFiscal.data.toISOString().split('T')[0]}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmpresaId">
                            <Form.Label>Empresa ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="empresaId"
                                value={newNotaFiscal.empresaId}
                                onChange={handleInputChange}
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

export default NotasFiscais;