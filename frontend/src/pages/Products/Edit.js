import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

export default class Edit extends React.Component {
  render() {
    return (
      <Container className="mt-5 mb-5">
        <Alert variant="warning" className="text-center p-5">
          <p><i className="far fa-sad-cry fa-3x"></i></p>
          <p>Desculpe.<br />Não deu tempo de fazer esta tela. </p>          
        </Alert>
        <div className="w-100 text-center">
          <Button onClick={() => this.props.history.goBack()} variant="outline-dark">
            <i className="fas fa-arrow-left fa-sm mr-1"></i> Voltar                
          </Button>
        </div>
      </Container>
    );
  }
}