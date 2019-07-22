import React from 'react';
import { Container, Card, Row, Col, Button, Form, Alert, ListGroup, Badge } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from '../../components/Alert';

export default class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      category: '',
      description: '',
      price: 0,
      item: '',
      amount: 1,
      items: [],
      kit: false,
      products: [],
      errors: {
        name: null,
        category: null,
        description: null,
        price: null,
        images: null,
        items: null
      },
      tree: {
        father: [],
        children: []
      }
    };

    this.images = React.createRef();
  }

  componentDidMount() {
    api.get('/categories')
       .then((response) => {
         const { data } = response;
         const { tree } = this.state;

         tree.father = data;

         this.setState({ 
           tree: tree 
         });
       })
       .catch(() => {
         this.props.history.goBack();

         toast({
           type: 'error',
           title: 'Não foi possível pegar as categorias de produtos.'
         });
       });

    api.get('/products')
       .then((response) => {
         const { data } = response;

         this.setState({
           products: data
         });
       })
       .catch(() => {
         toast({
           type: 'error',
           title: 'Não foi possível pegar a lista de produtos.'
         });
       });
  }

  handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    this.setState({
      [e.target.name]: value
    });
  }

  handleChangeCategory = (e) => {
    const { tree }      = this.state;
    const { value, id } = e.target;

    this.setState({
      category: ''
    });

    if (id === 'father') {
      tree.children = [];
    } else {
      let index = parseInt(id);

      if (tree.children.length > index) {
        tree.children.splice(index);
      }
    }

    api.get(`/categories/${value}`)
       .then((response) => {
         const { data } = response;

         if (data.children_categories.length > 0) {
           tree.children.push(data.children_categories);

           this.setState({
             tree: tree,
             final: false
           });
         } else {
           this.setState({
             category: value
           });
         }
       })
       .catch(() => {
         toast({
           type: 'error',
           title: 'Não foi possível pegar as categorias filhas. Tente novamente.'
         });
       });
  }
  
  handleCreate = (e) => {
    e.preventDefault();

    const errors = {
      name: null,
      category: null,
      description: null,
      price: null,
      images: null,
      items: null
    };

    this.setState({
      errors: errors
    });
    
    const { name, category, description, price, items } = this.state;
    const form                                          = new FormData();

    form.append('name', name);
    form.append('category', category);
    form.append('description', description);
    form.append('price', price);
    
    for (let i = 0; i < this.images.current.files.length; ++i) {
      form.append('images[]', this.images.current.files[i]);
    }

    for (let i = 0; i < items.length; ++i) {
      form.append(`items[${items[i].id}]`, items[i].amount);
    }

    api.post('/products', form)
       .then((response) => {  
         const { data } = response;

         this.props.history.push(`/products/${data.id}`);

         toast({
           type: 'success',
           title: 'Produto cadastrado.',
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
             title: 'Não foi possível cadastrar o produto. Tente novamente.',
           });

           console.error(error);
         }

         this.setState({
           errors: errors
         });
       });
  }

  handleAddItem = (e) => {
    const { item, amount, items, products } = this.state;

    if (item === '') {      
      toast({
        type: 'error',
        title: 'Selecione o produto.'
      });

      return false;
    }

    const id  = parseInt(item);
    let index = items.findIndex((product) => product.id === id);

    if (index > -1) {
      items[index].amount += amount;
    } else {
      index = products.findIndex((product) => product.id === id);

      if (index > -1) {
        items.push({
          id: id,
          name: products[index].name,
          amount: amount
        });
      } else {
        toast({
          type: 'error',
          title: 'Produto inválido.'
        });

        return false;
      }
    }
    
    this.setState({
      item: '',
      amount: 1,
      items: items
    });
  }

  handleDelItem = (id) => {
    const { items } = this.state;

    let index = items.findIndex((product) => product.id === id);

    if (index > -1) {
      items.splice(index, 1);
    }
    
    this.setState({
      items: items
    });
  }

  render() {
    return (
      <Container className="mt-5 mb-5">
        <Card className="shadow-sm p-3 mb-5 rounded" bg="white">
          <Form onSubmit={this.handleCreate}>
            <Card.Header className="bg-transparent">
              <Card.Title>Criar Produto</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Categoria</Form.Label>
                  <Form.Row>
                    <Col sm={6} md={4} lg={3}>
                      <Form.Control 
                        id="father"
                        as="select" 
                        onChange={this.handleChangeCategory} 
                        required
                        className="mb-2">
                          <option value="" hidden>Selecione</option>
                          {this.state.tree.father.map((value) => {
                            return <option value={value.id} key={value.id}>{value.name}</option>;
                          })}
                      </Form.Control>
                    </Col>
                    {this.state.tree.children.length > 0 && 
                      this.state.tree.children.map((value, index) => {
                        return (
                          <Col sm={6} md={4} lg={3} key={index}>
                            <Form.Control 
                              id={index + 1}
                              as="select"
                              onChange={this.handleChangeCategory} 
                              required
                              className="mb-2">
                                <option hidden>Selecione</option>
                                {value.map((item) => {
                                  return <option value={item.id} key={item.id}>{item.name}</option>;
                                })}
                            </Form.Control>
                          </Col>
                        );
                      })
                    }
                  </Form.Row>
                  <Form.Control.Feedback type="invalid">
                    {this.state.errors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              {this.state.category && (
                <Form.Row>
                  <Form.Group as={Col} sm={10} controlId="name">
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
                  <Form.Group as={Col} sm={2} controlId="price">
                    <Form.Label>Preço</Form.Label>
                    <Form.Control 
                      type="number"
                      name="price"
                      placeholder="E-mail"
                      value={this.state.price}
                      isInvalid={!!this.state.errors.price} 
                      onChange={this.handleChange}
                      required
                      step="0.01"
                    />
                    <Form.Control.Feedback type="invalid">
                      {this.state.errors.price}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} xs={12} controlId="description">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control 
                      as="textarea"
                      name="description"
                      placeholder="Descrição"
                      value={this.state.description}
                      isInvalid={!!this.state.errors.description} 
                      onChange={this.handleChange}
                      rows="5"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {this.state.errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} xs={12} sm={10} controlId="images">
                    <Form.Label>Imagens</Form.Label>
                    <Form.Control 
                      type="file"
                      name="images"
                      value={this.state.images}
                      isInvalid={!!this.state.errors.images} 
                      ref={this.images}
                      multiple
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {this.state.errors.images}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} xs={12} sm={2} controlId="kit">
                    <Form.Row>
                      <Col xs={12} className="mb-1">
                        Kit
                      </Col>
                      <Col xs={12}>
                        <Form.Label className="switch">
                          <Form.Control 
                            type="checkbox"
                            name="kit"
                            onChange={this.handleChange}
                          />
                          <span className="slider round"></span>
                        </Form.Label>
                      </Col>
                    </Form.Row>
                  </Form.Group>
                  {this.state.kit && (
                    <Form.Group as={Col} xs={12}>
                      {this.state.products.length > 0 ? ( 
                        <Form.Row>
                          <Col xs={7} sm={9}>
                            <Form.Label>Produto</Form.Label>
                            <Form.Control
                              as="select"
                              name="item"
                              onChange={this.handleChange} 
                              value={this.state.item}
                              required>
                                <option hidden>Selecione</option>
                                {this.state.products.map((product) => {
                                  return <option value={product.id} key={product.id}>{product.name}</option>;
                                })}
                            </Form.Control>
                          </Col>
                          <Col xs={3} sm={2}>
                            <Form.Label>Quantidade</Form.Label>
                            <Form.Control
                              name="amount"
                              type="number"
                              onChange={this.handleChange} 
                              value={this.state.amount}
                              min="1"
                              required
                            />
                          </Col>
                          <Col xs={2} sm={1}>
                            <Button 
                              variant="success"
                              onClick={this.handleAddItem}
                              className="btn-rounded mt-2rem">
                                <i className="fas fa-plus"></i>
                            </Button>
                          </Col>
                          <Col xs={12} className="mt-4">
                            {this.state.items.length > 0 ? (
                              <ListGroup>
                                {this.state.items.map((value, index) => {
                                  return (
                                    <ListGroup.Item key={index}>
                                      <Row>
                                        <Col xs={2} sm={1}>
                                          <Badge variant="primary" pill>{value.amount}</Badge>
                                        </Col>
                                        <Col xs={8} sm={10}>
                                          {value.name}
                                        </Col>
                                        <Col xs={2} sm={1} className="text-right">
                                          <Button
                                            variant="link"
                                            className="text-danger p-0"
                                            onClick={() => this.handleDelItem(parseInt(value.id))}>
                                            <i className="fas fa-trash"></i>
                                          </Button>
                                        </Col>
                                      </Row>
                                    </ListGroup.Item>
                                  );
                                })}
                              </ListGroup>
                            ) : (
                              <Alert variant="info">Nenhum item adicionado.</Alert>
                            )}
                          </Col>
                        </Form.Row>
                      ) : (
                        <Alert variant="info">Sem itens para exibir.</Alert>
                      )}
                      <Form.Control.Feedback type="invalid">
                        {this.state.errors.items}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}
                </Form.Row>
              )}
            </Card.Body>
            <Card.Footer className="bg-transparent text-center">
              <Form.Row>
                <Form.Group as={Col} xs={12} sm={4} md={3} lg={2} controlId="back" className="offset-sm-2 offset-md-3 offset-lg-4">
                  <Button onClick={() => this.props.history.goBack()} variant="outline-dark" className="btn-block">
                    <i className="fas fa-arrow-left fa-sm mr-1"></i> Voltar                
                  </Button>
                </Form.Group>
                <Form.Group as={Col} xs={12} sm={4} md={3} lg={2} controlId="save">
                  <Button type="submit" variant="outline-success" disabled={!this.state.category} className="btn-block">
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