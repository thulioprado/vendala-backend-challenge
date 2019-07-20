import React from 'react';
import { Navbar, Nav, Image, Container, Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { isAuth, logout } from '../services/auth';
import api from '../services/api';
import { withRouter } from 'react-router-dom';

class Navbart extends React.Component {
  handleSignOut = () => {
    if (isAuth()) {
      api.get('/auth/logout');
    }

    logout();    
    this.props.history.push('/home');
  }

  render() {
    return (
      <Navbar bg="light" expand="md" className="shadow-sm">
        <Container>
          <Navbar.Brand>
            <Link to="/">
              <Image src={require('../assets/logo.png')} height="60"/>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ml-auto">          
              <Nav.Link as={NavLink} to="/users" activeClassName="active">Usuários</Nav.Link>
              <Nav.Link as={NavLink} to="/products" activeClassName="active">Produtos</Nav.Link>
              <Nav.Link as={NavLink} to="/kits" activeClassName="active">Kits</Nav.Link>
              <Nav.Link as={Button} onClick={this.handleSignOut} variant="danger" className="w-sm-50">Sair</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default withRouter(Navbart)