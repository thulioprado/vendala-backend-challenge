import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default class Error404 extends React.Component {
  render() {
    return (
      <Container className="h-100">
        <Row className="align-items-center justify-content-center h-100">
          <Col>
            <Row className="mb-3">
              <Col xs={6} className="text-right border-right">
                <span className="error-code">404</span>
              </Col>
              <Col xs={6} className="text-left">
                <p className="error-title mt-2">Putz!</p>
                <p className="error-description mt-1">Deu ruim.</p>
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <Button onClick={() => this.props.history.goBack()} variant="outline-dark">Clique aqui para voltar</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}