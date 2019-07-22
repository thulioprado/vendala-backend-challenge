import React from 'react';
import { Container, Card, Col, Button, Form } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from '../../components/Alert';

export default class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      errors: {
        name: null,
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
  
  handleCreate = (e) => {
    e.preventDefault();
    
    const errors = {
      name: null,
      email: null,
      password: null
    };

    this.setState({
      errors: errors
    });
    
    const { name, email, password } = this.state;

    api.post('/users', { name, email, password })
       .then((response) => {  
         const { data } = response;

         this.props.history.push(`/users/${data.id}`);

         toast({
           type: 'success',
           title: 'Usuário cadastrado.',
         });
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

           toast({
             type: 'error',
             title: 'Por favor, verifique os campos.',
           });
         } catch (e) {
           toast({
             type: 'error',
             title: 'Não foi possível cadastrar o usuário. Tente novamente.',
           });

           console.error(error);
         }

         this.setState({
           errors: errors
         });
       });
  }

  render() {
    return (
      <Container className="mt-5 mb-5">
        <Card className="shadow-sm p-3 mb-5 rounded" bg="white">
          <Form onSubmit={this.handleCreate}>
            <Card.Header className="bg-transparent">
              <Card.Title>Criar Usuário</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col} sm={6} controlId="name">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control 
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={this.state.name}
                    isInvalid={!!this.state.errors.name} 
                    onChange={this.handleChange}
                    autoFocus={true}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {this.state.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm={6} controlId="email">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control 
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={this.state.email}
                    isInvalid={!!this.state.errors.email} 
                    onChange={this.handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {this.state.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm={6} controlId="password">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control 
                    type="password"
                    name="password"
                    placeholder="Senha"
                    value={this.state.password}
                    isInvalid={!!this.state.errors.password} 
                    onChange={this.handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {this.state.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
            </Card.Body>
            <Card.Footer className="bg-transparent text-center">
              <Form.Row>
                <Form.Group as={Col} xs={12} sm={4} md={3} lg={2} controlId="back" className="offset-sm-2 offset-md-3 offset-lg-4">
                  <Button onClick={() => this.props.history.goBack()} variant="outline-dark" className="btn-block">
                    <i className="fas fa-arrow-left fa-sm mr-1"></i> Voltar                
                  </Button>
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={4} md={3} lg={2} controlId="save">
                  <Button type="submit" variant="outline-success" className="btn-block">
                    <i className="fas fa-check fa-sm mr-1"></i> Criar                
                  </Button>
                </Form.Group>
              </Form.Row>
            </Card.Footer>
          </Form>
        </Card>
      </Container>
    );
  }
}