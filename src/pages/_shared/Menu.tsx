import { use } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Menu() {
    const navigate = useNavigate();
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand href="#home">Recebiveis</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">                
                <Nav.Link onClick={() => navigate("/")}>Inicio</Nav.Link>                
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default Menu;