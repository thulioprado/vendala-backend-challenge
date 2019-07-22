import React from 'react';
import { Image } from 'react-bootstrap';

export default () => (
  <div className="footer flex">
    <Image src={require('../assets/logo.png')} height="30" />
    <p>Criado por <a href="https://github.com/thulioprado" target="_blank" rel="noopener noreferrer">@thulioprado</a>.</p>
  </div>
);