import React from 'react';
import { Container, Card, Row, Col, Button, Alert, Form } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from '../../components/Alert';

export default class Show extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null
    };
  }

  componentDidMount() {
    const { match: { params } } = this.props;

    api.get(`/users/${params.id}`)
       .then((response) => {
         const { data } = response;

         this.setState({
           loading: false,
           user: data
         });
       })
       .catch(() => {
         this.props.history.goBack();

         toast({
           type: 'error',
           title: 'Não foi possível pegar os dados do usuário.'
         });
       });
  }

  render() {
    return (
      <Container className="mt-5 mb-5">
        <Card className="shadow-sm p-3 mb-5 rounded" bg="white">
          <Card.Header className="bg-transparent">
            <Card.Title>Ver Usuário</Card.Title>
          </Card.Header>
          <Card.Body>
            {!this.state.loading ? (
              this.state.user && (
                <Row>
                  <Col sm={6}>
                    <p>
                      <strong>Nome:</strong><br />
                      {this.state.user.name}
                    </p>
                    <p>
                      <strong>E-mail:</strong><br />
                      {this.state.user.email}
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p>
                      <strong>Criado em:</strong><br />
                      {this.state.user.created_at}
                    </p>
                    <p>
                      <strong>Atualizado em:</strong><br />
                      {this.state.user.updated_at}
                    </p>
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
                <Button onClick={() => this.props.history.push(`/users/${this.props.match.params.id}/edit`)} variant="outline-dark" className="btn-block">
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