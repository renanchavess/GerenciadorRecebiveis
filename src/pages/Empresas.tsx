import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import { Empresa as EmpresaModel, getRamoName, Ramo } from "../models/Empresa";
import { useEffect, useState } from "react";
import EmpresaService from "../services/EmpresaService";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { NotifyContext } from "../context/NotifyContext";

function Empresas() {
    const [empresas, setEmpresas] = useState<EmpresaModel[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newEmpresa, setNewEmpresa] = useState<EmpresaModel>({ id: 0, nome: '', cnpj: '', faturamento: 0, ramo: Ramo.Servico });
    const [errors, setErrors] = useState<{ nome?: string, cnpj?: string, faturamento?: string }>({});
    const navigate = useNavigate();
    const empresaService = new EmpresaService();
    const { notification } = useContext(NotifyContext);

    useEffect(() => {
        empresaService.getEmpresas().then(empresas => setEmpresas(empresas));
    }, []);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEmpresa({ ...newEmpresa, [name]: value });
    };

    const handleRamoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmpresa({ ...newEmpresa, ramo: parseInt(e.target.value) });
    };

    const validate = () => {
        const errors: { nome?: string, cnpj?: string, faturamento?: string } = {};
        if (!newEmpresa.nome || newEmpresa.nome.length < 2) {
            errors.nome = 'Nome é obrigatório e deve ter pelo menos 2 caracteres.';
        }
        if (!newEmpresa.cnpj || newEmpresa.cnpj.length !== 18) {
            errors.cnpj = 'CNPJ é obrigatório e deve ter exatamente 18 caracteres.';
        }
        if (!newEmpresa.faturamento || newEmpresa.faturamento <= 0) {
            errors.faturamento = 'Faturamento é obrigatório e deve ser maior que zero.';
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

        const result = await empresaService.createEmpresa(newEmpresa);
        const data = await result.json();

        if (result.status === 200 || result.status === 201) {
            empresaService.getEmpresas().then(empresas => setEmpresas(empresas));
            handleCloseModal();
        } else {
            notification(data.Message, 'error')
        }
    };

    return (
        <Container>
            <h1>Empresas</h1>
            <Button className="my-3" variant="success" onClick={handleShowModal}>Registrar Empresa</Button>
            {
                empresas.length === 0 ? <p className="registros-vazio">Nenhuma empresa registrada.</p> :
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
                                        <td>R$ {empresa.faturamento.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
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
                                isInvalid={!!errors.nome}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.nome}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formCnpj" className="mt-3">
                            <Form.Label>CNPJ</Form.Label>
                            <Form.Control
                                type="text"
                                name="cnpj"
                                value={newEmpresa.cnpj}
                                onChange={handleInputChange}
                                isInvalid={!!errors.cnpj}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.cnpj}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formFaturamento" className="mt-3">
                            <Form.Label>Faturamento</Form.Label>
                            <Form.Control
                                type="number"
                                name="faturamento"
                                value={newEmpresa.faturamento}
                                onChange={handleInputChange}
                                isInvalid={!!errors.faturamento}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.faturamento}
                            </Form.Control.Feedback>
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
                                onChange={event => handleRamoChange(event)}
                                required
                            />
                            <Form.Check
                                inline
                                key={Ramo.Servico}
                                type="radio"
                                name="ramo"
                                value={Ramo.Servico}
                                label={getRamoName(Ramo.Servico)}
                                checked={newEmpresa.ramo === Ramo.Servico}
                                onChange={event => handleRamoChange(event)}
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