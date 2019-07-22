import React from 'react';
import { Navbar, Nav, Image, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { isAuth, logout } from '../services/auth';
import api from '../services/api';
import { withRouter } from 'react-router-dom';
import { toast } from '../components/Alert';

class Navbart extends React.Component {
  handleSignOut = async () => {
    toast({
      type: 'success',
      title: 'Desconectado.'
    });

    if (isAuth()) {
      await api.get('/auth/logout');
    }

    logout();    
    this.props.history.push('/home');
  }

  render() {
    return (
      <Navbar bg="white" expand="md" className="shadow-sm">
        <Container>
          <Navbar.Brand className="abs">
            <Link to="/">
              <Image src={require('../assets/logo.png')} height="60"/>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="text-center font-weight-bold">          
              <Nav.Link as={NavLink} to="/users" activeClassName="active" className="mr-md-3">Usuários</Nav.Link>
              <Nav.Link as={NavLink} to="/products" activeClassName="active" className="mr-md-3">Produtos</Nav.Link>
            </Nav>
            <Nav className="ml-auto text-center">
              <Nav.Link onClick={this.handleSignOut} className="text-danger nav-button">
                <i className="fas fa-power-off"></i>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default withRouter(Navbart)