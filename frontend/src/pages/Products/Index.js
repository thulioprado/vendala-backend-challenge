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
      products: [],
      error: false,
      selectedId: null
    };
  }

  componentDidMount() {
    api.get('/products')
       .then((response) => {
         const { data } = response;

         this.setState({
           loading: false,
           products: data,
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
    this.props.history.push('/products/create');
  }

  handleShow = () => {
    if (this.state.selectedId === null) {
      toast({
        type: 'error',
        title: 'Selecione um produto.'
      });
    } else {
      this.props.history.push(`/products/${this.state.selectedId}`);
    }
  }

  handleEdit = () => {
    if (this.state.selectedId === null) {
      toast({
        type: 'error',
        title: 'Selecione um produto.'
      });
    } else {
      this.props.history.push(`/products/${this.state.selectedId}/edit`);
    }
  }

  handleDelete = () => {
    if (this.state.selectedId === null) {
      toast({
        type: 'error',
        title: 'Selecione um produto.'
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

          api.delete(`/products/${this.state.selectedId}`)
             .then(() => {
               const { products } = this.state;

               for (let i = 0; i < products.length; ++i) {
                 if (products[i].id === this.state.selectedId) {
                   products.splice(i, 1);
                   break;
                 }
               }
               
               this.setState({
                 loading: false,
                 products: products,
                 selectedId: null
               });
               
               toast({
                 type: 'success',
                 title: 'Produto excluído.'
               });
             })
             .catch(() => {
               toast({
                 type: 'error',
                 title: 'Não foi possível excluir o produto. Tente novamente.'
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
                <Card.Title>Produtos</Card.Title>
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
                    title="Produtos"
                    header={true}
                    checkbox={true}
                    data={this.state.products}
                    columns={[
                      {
                        title: 'Nome',
                        name: 'name'
                      },
                      {
                        title: 'Categoria',
                        name: 'category',
                      },
                      {
                        title: 'Descrição',
                        name: 'description',
                      },
                      {
                        title: 'Preço',
                        name: 'price',
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