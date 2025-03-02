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
    const [empresaId, setEmpresaId] = useState(0);
    const [errors, setErrors] = useState<{ numero?: string, valor?: string, data?: string }>({});
    const notaFiscalService = new NotaFiscalService();
    const empresaService = new EmpresaService();

    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const empresaId = queryParams.get('id');

        if (empresaId === null) {
            navigate("/");
        }
        setEmpresaId(parseInt(empresaId));

        empresaService.getEmpresa(empresaId).then(empresa => setEmpresa(empresa));
        notaFiscalService.getNotasFiscais(empresaId).then(notasFiscais => setNotasFiscais(notasFiscais));
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

    const validate = () => {
        const errors: { numero?: string, valor?: string, data?: string } = {};
        if (!newNotaFiscal.numero || newNotaFiscal.numero <= 0) {
            errors.numero = 'Número é obrigatório e deve ser maior que zero.';
        }
        if (!newNotaFiscal.valor || newNotaFiscal.valor <= 0) {
            errors.valor = 'Valor é obrigatório e deve ser maior que zero.';
        }
        if (!newNotaFiscal.data || newNotaFiscal.data <= new Date()) {
            errors.data = 'Data é obrigatória e deve ser maior que hoje.';
        }
        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        newNotaFiscal.empresaId = empresaId;
        await new NotaFiscalService().createNotaFiscal(newNotaFiscal);        
        handleCloseModal();
        notaFiscalService.getNotasFiscais(empresaId).then(notasFiscais => setNotasFiscais(notasFiscais));
    };

    return (
        empresa?.id === undefined ? <></> :
        <Container>
            <h1>NFs - {empresa.nome}</h1>
            <hr />

            <Button variant="success" className="my-3" onClick={handleShowModal}>Registrar nova NF</Button>
            <Row>
                <Col sm={12}>                    
                    <div className="table-responsive">
                        {
                            notasFiscais.length === 0 ? <p className="registros-vazio">Nenhuma nota fiscal encontrada</p>: 
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
                                                    <td>R$ {notaFiscal.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                    <td>{notaFiscal.data.toLocaleDateString()}</td>
                                                    <td>{notaFiscal.empresaId}</td>
                                                    <td>{notaFiscal.carrinhoId}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        }
                        
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
                                type="number"
                                name="numero"
                                value={newNotaFiscal.numero}
                                onChange={handleInputChange}
                                isInvalid={!!errors.numero}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.numero}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formValor" className="mt-3">
                            <Form.Label>Valor</Form.Label>
                            <Form.Control
                                type="number"
                                name="valor"
                                value={newNotaFiscal.valor}
                                onChange={handleInputChange}
                                isInvalid={!!errors.valor}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.valor}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formData" className="mt-3">
                            <Form.Label>Data</Form.Label>
                            <Form.Control
                                type="date"
                                name="data"
                                value={newNotaFiscal.data.toISOString().split('T')[0]}
                                onChange={handleInputChange}
                                isInvalid={!!errors.data}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.data}
                            </Form.Control.Feedback>
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