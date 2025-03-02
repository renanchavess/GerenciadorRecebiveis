import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Modal, Row, Table } from "react-bootstrap";
import NotaFiscal from "../models/NotaFiscal";
import NotaFiscalService from "../services/NotaFiscalService";
import CarrinhoService from "../services/CarrinhoService";
import { useNavigate } from "react-router-dom";
import Carrinho from "../models/Carrinho";
import AlertComponent from "../components/AlertComponent";

function CarrinhoNotas() {
    const [carrinho, setCarrinho] = useState<Carrinho>(new Carrinho(0, 0, null, false));
    const [allNotasFiscais, setAllNotasFiscais] = useState<NotaFiscal[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [carrinhoId, setCarrinhoId] = useState<number | null>(null);
    const [empresaId, setEmpresaId] = useState<number | null>(null);
    const [total, setTotal] = useState(0);
    const [onlyRead, setOnlyRead] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const notaFiscalService = new NotaFiscalService();
    const carrinhoService = new CarrinhoService();
    const navigate = useNavigate();

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('id');
        const empresaId = new URLSearchParams(window.location.search).get('empresaId');
        
        if (id === null || empresaId === null) {
            navigate("/");
            return;
        } 
        setCarrinhoId(parseInt(id));
        setEmpresaId(parseInt(empresaId));
    }, []);

    useEffect(() => {
        if (carrinhoId !== null) {
            console.log(carrinhoId);
            getData();
        }
    }, [carrinhoId]);

    useEffect(() => {
        if (carrinho === undefined) 
            return;

        const total = carrinho.notasFiscais?.reduce((acc, nota) => acc + nota.valor, 0) || 0;
        setTotal(total);        
    }, [carrinho]);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAddNotaFiscal = async (notaFiscalId: number) => {
        const result = await carrinhoService.adicionarNotaFiscal(carrinhoId, notaFiscalId);
        const data = await result.json();

        if (!result.ok) {
            alertaPopup(data.Message, 'danger');
        }

        getData();
    };

    const handleRemoveNotaFiscal = async (notaFiscalId: number) => {
        if (carrinhoId !== null) {
            await carrinhoService.removeNotaFiscal(carrinhoId, notaFiscalId);            
            getData();
        }
    };

    const handleCheckout = async () => {
        if (carrinhoId !== null) {
            const result = await carrinhoService.checkoutCarrinho(carrinhoId);

            if (result.ok) {
                const checkoutData = await result.json();
                console.log(checkoutData);
                setCheckoutData(checkoutData);''
                setShowCheckoutModal(true);
                getData();
            } else {
                
                const error:any = await result.json();
                alertaPopup(error.Message, 'danger');
            }

            const carrinho = await carrinhoService.getCarrinho(carrinhoId);
            setCarrinho(carrinho);
            getData();
        }
    };

    const alertaPopup = (message: string, tipo: string) => {
        setAlertType(tipo);
        setAlertMessage(message);        
        setShowAlert(true);
    }


    const handleCloseCheckoutModal = () => setShowCheckoutModal(false);

    const getData = () => {     
        console.log(carrinhoId);
    
        carrinhoService.getCarrinho(parseInt(carrinhoId)).then(
            carrinho => { 
                setCarrinho(carrinho)
                setOnlyRead(carrinho.checkout)
            }
        );
        notaFiscalService.getNotasFiscais(parseInt(empresaId)).then(notas => setAllNotasFiscais(notas));        
    }

    return (        
        <Container className="d-flex flex-column align-items-center">
            <AlertComponent
                variant={alertType}
                message={alertMessage}
                show={showAlert}
                onClose={() => setShowAlert(false)}
            />
            <Row className="w-100">
                <Col md={{span: 8, offset: 2}} sm={12}>
                    <h1>Carrinho de Compras</h1>            
                    
                    <div className="d-flex justify-content-between w-100">
                        {
                            !onlyRead &&
                            <Button 
                                variant="success" 
                                className="my-3"
                                onClick={handleShowModal}>
                                    Adicionar Nota Fiscal
                            </Button>
                        }
                        {
                            !onlyRead && 
                            <Button
                                onClick={handleCheckout}
                                disabled={carrinho.notasFiscais?.length === 0}
                                variant="dark" 
                                className="my-3">
                                    Realizar checkout
                            </Button>
                        }
                    </div>

                    {
                        total > 0 ? 
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Número</th>
                                    <th>Valor</th>
                                    <th>Data</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrinho.notasFiscais?.map(nota => (
                                    <tr key={nota.id}>
                                        <td>{nota.id}</td>
                                        <td>{nota.numero}</td>
                                        <td>R$ {nota.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                        <td>{nota.data.toLocaleString().split(',')[0]}</td>
                                        <td>
                                            <Button
                                                disabled={onlyRead}                                  
                                                variant={onlyRead ? "secondary" : "danger"}
                                                onClick={() => handleRemoveNotaFiscal(nota.id)}>
                                                    Remover
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={1}><strong>Total</strong></td>
                                    <td colSpan={4}><strong>R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
                                </tr>
                            </tfoot>
                        </Table>
                        : <p className="registros-vazio">Nenhuma nota fiscal adicionada</p>
                    }
                </Col>
            </Row>
            
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Nota Fiscal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                         (allNotasFiscais.filter(nota => nota.carrinhoId === null)).length === 0 ?
                         <p className="registros-vazio">Nenhuma nota fiscal disponível</p> :
                         <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Número</th>
                                    <th>Valor</th>
                                    <th>Data</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                            {                                
                                allNotasFiscais.map(nota => {
                                    if (nota.carrinhoId === null) {
                                        return (
                                            <tr key={nota.id}>
                                                <td>{nota.id}</td>
                                                <td>{nota.numero}</td>
                                                <td>R$ {nota.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                                <td>{nota.data.toLocaleDateString()}</td>
                                                <td>
                                                    <Button variant="success" onClick={() => handleAddNotaFiscal(nota.id)}>Adicionar</Button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                })
                            }
                            </tbody>                            
                        </Table>
                    }
                    
                </Modal.Body>
            </Modal>

            <Modal show={showCheckoutModal} onHide={handleCloseCheckoutModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Dados do Checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {checkoutData && (
                        <div>
                            <p><strong>Empresa:</strong> {checkoutData.empresa}</p>
                            <p><strong>CNPJ:</strong> {checkoutData.cnpj}</p>
                            <p><strong>Limite:</strong> R$ {checkoutData.limite.toFixed(2)}</p>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Valor Bruto</th>
                                        <th>Valor Líquido</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkoutData.notas_fiscais.map((nota: any) => (
                                        <tr key={nota.numero}>
                                            <td>{nota.numero}</td>
                                            <td>R$ {nota.valor_bruto.toFixed(2)}</td>
                                            <td>R$ {nota.valor_liquido.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default CarrinhoNotas;