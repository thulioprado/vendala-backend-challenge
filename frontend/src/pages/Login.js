import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import api from '../services/api';
import { login } from '../services/auth';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',              
      errors: {
        email: null,
        password: null
      }
    };
  }
  
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSignIn = async (e) => {
    e.preventDefault();

    const errors = {
      email: '',
      password: ''
    };

    this.setState({
      errors: errors
    });
    
    const { email, password } = this.state;

    if (!email) {
      errors.email = 'O seu e-mail é necessário, mano.';
    }

    if (!password) {
      errors.password = 'Pow brow. Qual é a senha?';
    }

    if (email && password) {
      api.post('/auth/login', { email, password })
         .then((response) => {
           const { data } = response;

           login(data.token);
  
           this.props.history.push('/home');
         })
         .catch((error) => {
           try {
             const { data } = error.response;

             Object.entries(data.errors)
                   .forEach(([key, value]) => {
                     if (key in errors) {
                       errors[key] = value[0];
                     }
                   });
           } catch (e) {
             errors.email    = 'Deu muita merda, parceiro!';
             errors.password = 'Corre que o bicho tá pegando.';

             console.error(error);
           }
           
           this.setState({
             errors: errors
           });
         });
    } else {
      this.setState({
        errors: errors
      });
    }
  }

  componentWillMount() {
    document.body.classList.add('login-body');
  }

  componentWillUnmount() {
    document.body.classList.remove('login-body');    
  }

  render() {
    return (
      <Container className="h-100">
        <Row className="align-items-center justify-content-center h-100">
          <Col sm={9} md={7} lg={6} xl={5}>
            <Card className="shadow p-3 mb-5 rounded" bg="white">
              <Card.Header className="bg-transparent text-center">
                <Card.Img src={require('../assets/logo.png')} className="w-75 mb-1" fluid="true" />
              </Card.Header>
              <Card.Body>
                <Form className="form-signin" onSubmit={this.handleSignIn}>
                  <Form.Group className="form-label-group">
                    <Form.Control 
                      id="email"
                      type="email"
                      name="email"
                      placeholder="E-mail"
                      value={this.state.email}
                      isInvalid={!!this.state.errors.email} 
                      onChange={this.handleChange}
                      autoFocus={true}
                    />
                    <Form.Label htmlFor="email">E-mail</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {this.state.errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="form-label-group">
                    <Form.Control 
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Senha"
                      value={this.state.password}
                      isInvalid={!!this.state.errors.password} 
                      onChange={this.handleChange}
                    />
                    <Form.Label htmlFor="password">Senha</Form.Label>
                    <Form.Control.Feedback type="invalid">
                      {this.state.errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" size="lg" variant="primary" block>Entrar</Button>
                </Form>
              </Card.Body>
              <Card.Footer className="bg-transparent text-center">
                Criado por <Card.Link href="https://github.com/thulioprado" target="_blank">@thulioprado</Card.Link>.
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}