import React from 'react';
import { Carousel, Image } from 'react-bootstrap';
import api from '../services/api';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: 0,
      products: 0,
      kits: 0
    };
  }

  componentDidMount() {
    api.get('/statistics')
       .then((response) => {
         const { data } = response;

         this.setState({
           users: data.users,
           products: data.products,
           kits: data.kits
         });
       });
  }

  render() {
    return (
      <Carousel>
        <Carousel.Item>
          <Image className="d-block w-100 h-100" src={require('../assets/users-carousel.jpg')} alt="Usuários" />
          <Carousel.Caption>
            <h3>Usuários</h3>
            <p>
              <strong>{this.state.users}</strong> usuários já sacaram que este teste é o bicho.<br />
              <s><i>Uma verdade fácil de engolir</i></s>
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image className="d-block w-100 h-100" src={require('../assets/products-carousel.jpg')} alt="Produtos" />
          <Carousel.Caption>
            <h3>Produtos</h3>
            <p>
              Com <strong>{this.state.products}</strong> produtos registrados.<br />
              <i>*Olokinho meu!*</i>
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image className="d-block w-100 h-100" src={require('../assets/kits-carousel.jpg')} alt="Kits" />
          <Carousel.Caption>
            <h3>Kits</h3>
            <p>
              E <strong>{this.state.kits}</strong> combinações de produtos.<br />
              <i>#combinei #populei #ahazei</i>
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
  }
}