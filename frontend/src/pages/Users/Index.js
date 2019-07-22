import React from 'react';
import { Container, Card, Alert, Row, Col, Form, Button } from 'react-bootstrap';
import api from '../../services/api';
import DataTable from '../../components/DataTable';
import { alert, toast } from '../../components/Alert';

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      users: [],
      error: false,
      selectedId: null
    };
  }

  componentDidMount() {
    api.get('/users')
       .then((response) => {
         const { data } = response;

         this.setState({
           loading: false,
           users: data,
         });
       })
       .catch((error) => {
         this.setState({
           loading: false,
           error: true
         });
       });
  }

  handleChange = () => {
    const id = document.querySelector('input[type="radio"]:checked').value;

    this.setState({
      selectedId: parseInt(id)
    });
  }

  handleCreate = () => {
    this.props.history.push('/users/create');
  }

  handleShow = () => {
    if (this.state.selectedId === null) {
      toast({
        type: 'error',
        title: 'Selecione um usuário.'
      });
    } else {
      this.props.history.push(`/users/${this.state.selectedId}`);
    }
  }

  handleEdit = () => {
    if (this.state.selectedId === null) {
      toast({
        type: 'error',
        title: 'Selecione um usuário.'
      });
    } else {
      this.props.history.push(`/users/${this.state.selectedId}/edit`);
    }
  }

  handleDelete = () => {
    if (this.state.selectedId === null) {
      toast({
        type: 'error',
        title: 'Selecione um usuário.'
      });
    } else {
      alert({
        type: 'warning',
        title: 'Você tem certeza?',
        text: 'Você poderá reverter esta ação se desejar.',
        confirm: 'Sim, exclua.',
        cancel: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          this.setState({
            loading: true
          });

          api.delete(`/users/${this.state.selectedId}`)
             .then(() => {
               const { users } = this.state;

               for (let i = 0; i < users.length; ++i) {
                 if (users[i].id === this.state.selectedId) {
                   users.splice(i, 1);
                   break;
                 }
               }
               
               this.setState({
                 loading: false,
                 users: users,
                 selectedId: null
               });
               
               toast({
                 type: 'success',
                 title: 'Usuário excluído.'
               });
             })
             .catch(() => {
               toast({
                 type: 'error',
                 title: 'Não foi possível excluir o usuário. Tente novamente.'
               })
             });
        }
      });
    }
  }

  render() {
    return (
      <Container className="mt-5 mb-5">
        <Card className="shadow-sm p-3 mb-5 rounded" bg="white">
          <Card.Header className="bg-transparent">
            <Row>
              <Col md={6}>
                <Card.Title>Usuários</Card.Title>
              </Col>
              <Col md={6} className="text-right">
                <Button onClick={this.handleCreate} variant="link" className="mr-2 p-0 text-success">
                  <i className="fas fa-plus"></i>
                </Button>
                <Button onClick={this.handleShow} variant="link" className="mr-2 p-0">
                  <i className="fas fa-eye"></i>
                </Button>
                <Button onClick={this.handleEdit} variant="link" className="mr-2 p-0">
                  <i className="fas fa-edit"></i>
                </Button>
                <Button onClick={this.handleDelete} variant="link" className="p-0 text-danger">
                  <i className="fas fa-trash"></i>
                </Button>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            {!this.state.loading ? (
              this.state.error ? ( 
                <Alert variant="danger">
                  Nenhum registro para mostrar.
                </Alert>
              ) : (
                <Form onChange={this.handleChange}>
                  <DataTable
                    title="Usuários"
                    header={true}
                    checkbox={true}
                    data={this.state.users}
                    columns={[
                      {
                        title: 'Nome',
                        name: 'name'
                      },
                      {
                        title: 'E-mail',
                        name: 'email',
                      },
                      {
                        title: 'Criado em',
                        name: 'created_at',
                      },
                      {
                        title: 'Atualizado em',
                        name: 'updated_at',
                      }
                    ]}
                  />
                </Form>
              )
            ) : (
              <Alert variant="info" className="text-center">                
                <i className="fas fa-circle-notch fa-spin mr-1"></i> Carregando...
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Container>
    );
  }
}