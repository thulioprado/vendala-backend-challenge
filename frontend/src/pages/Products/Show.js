import React from 'react';
import { Container, Card, Row, Col, Button, Form, Alert, ListGroup, 
         Badge, Carousel, Image } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from '../../components/Alert';

export default class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      product: null,
      images: []
    };

    this.images = React.createRef();
  }

  componentDidMount() {
    const { match: { params } } = this.props;

    api.get(`/products/${params.id}`)
       .then((response) => {
         const { data } = response;

         this.setState({
           product: data
         });

         api.get(`/categories/${data.category}`)
            .then((response) => {
              const { data }    = response;
              const { product } = this.state;
              let images        = [];

              product.category  = data.name;

              if (product.images.length > 0) {
                product.images.map((image) => {
                  images.push(image.path);                  
                  return true;
                });
              }

              if (product.items.length > 0) {
                product.items.map((value) => {
                  if (value.product.images.length > 0) {
                    value.product.images.map((image) => {
                      images.push(image.path);
                      return true;
                    });
                  }
                  
                  return true;
                });
              }

              this.setState({
                loading: false,
                product: product,
                images: images
              });
            })
            .catch(() => {
              this.props.history.goBack();

              toast({
                type: 'error',
                title: 'Não foi possível pegar os dados do produto.'
              });
            });
       })
       .catch(() => {
         this.props.history.goBack();

         toast({
           type: 'error',
           title: 'Não foi possível pegar os dados do produto.'
         });
       });
  }

  render() {
    return (
      <Container className="mt-5 mb-5">
        <Card className="shadow-sm p-3 mb-5 rounded" bg="white">
          <Card.Header className="bg-transparent">
            <Card.Title>Ver Produto</Card.Title>
          </Card.Header>
          <Card.Body>
            {!this.state.loading ? (
              this.state.product && (
                <Row>
                  {this.state.images.length > 0 && (
                    <Col xs={12} sm={6} className="mb-3">
                      <Carousel className="carousel-small">
                        {this.state.images.map((image, index) => {
                          return (
                            <Carousel.Item key={index}>
                              <Image className="d-block w-100 h-100" src={image} />
                            </Carousel.Item>
                          );
                        })}
                      </Carousel>
                    </Col>
                  )}
                  <Col xs={12} sm={this.state.images.length > 0 ? 6 : 12} className="mb-3">
                    <Row>
                      <Col xs={12} sm={6}>
                        <p>
                          <strong>Nome:</strong><br />
                          {this.state.product.name}
                        </p>
                      </Col>
                      <Col xs={12} sm={6}>
                        <p>
                          <strong>Categoria:</strong><br />
                          {this.state.product.category}
                        </p>
                      </Col>
                      <Col xs={12} sm={6}>
                        <p>
                          <strong>Preço:</strong><br />
                          R${this.state.product.price}
                        </p>
                      </Col>
                      <Col xs={12} sm={6}>
                        <p>
                          <strong>Criado em:</strong><br />
                          {this.state.product.created_at}
                        </p>
                      </Col>
                      <Col xs={12} sm={6}>
                        <p>
                          <strong>Atualizado em:</strong><br />
                          {this.state.product.updated_at}
                        </p>
                      </Col>
                      {this.state.product.items.length > 0 && (
                        <Col xs={12} sm={6}>
                          <Badge variant="success">KIT</Badge>
                        </Col>
                      )}                      
                      <Col xs={12}>
                        <p>
                          <strong>Descrição:</strong><br />
                          {this.state.product.description}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    {this.state.product.items.length > 0 &&
                      this.state.product.items.map((value, index) => {
                        return (
                          <ListGroup.Item key={index}>
                            <Row>
                              <Col xs={2} sm={1}>
                                <Badge variant="primary" pill>{value.amount}</Badge>
                              </Col>
                              <Col xs={8} sm={11}>
                                {value.product.name}
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        );
                      })
                    }
                  </Col>
                </Row>
              )
            ) : (
              <Alert variant="info" className="text-center">                
                <i className="fas fa-circle-notch fa-spin mr-1"></i> Carregando...
              </Alert>
            )}
          </Card.Body>
          <Card.Footer className="bg-transparent text-center">
            <Form.Row>
              <Form.Group as={Col} xs={12} sm={4} md={3} lg={2} className="offset-sm-2 offset-md-3 offset-lg-4">
                <Button onClick={() => this.props.history.goBack()} variant="outline-dark" className="btn-block">
                  <i className="fas fa-arrow-left fa-sm mr-1"></i> Voltar                
                </Button>
              </Form.Group>
              <Form.Group as={Col} xs={12} sm={4} md={3} lg={2}>
                <Button onClick={() => this.props.history.push(`/products/${this.props.match.params.id}/edit`)} variant="outline-dark" className="btn-block">
                  <i className="fas fa-edit fa-sm mr-1"></i> Editar                
                </Button>
              </Form.Group>
            </Form.Row>
          </Card.Footer>
        </Card>
      </Container>
    );
  }
}