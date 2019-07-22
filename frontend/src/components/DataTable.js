import React from 'react';
import { Form } from 'react-bootstrap';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';

const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

export default class DataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      element: null,
      table: null
    };
  }

  componentDidMount() {
    this.setState({
      element: $(this.el),
      table: $(this.el).DataTable({
        pagingType: 'first_last_numbers',
        lengthMenu: [
          [ 5, 10, 20, 30, 40, 50 ],
          [ 5, 10, 20, 30, 40, 50 ]
        ],
        pageLength: 10,
        order: [
          [ 1, 'asc' ]
        ],
        columnDefs: [
          {
            orderable: false,
            targets: 0
          },
        ],
        language: {
          processing: 'Processando...',
          search: 'Pesquisar por:',
          lengthMenu: 'Exibir _MENU_ ' + this.props.title.toLowerCase(),
          info: '_START_-_END_ de _TOTAL_',
          infoEmpty: '0-0 de 0',
          infoFiltered: '(Filtrados de _MAX_ registros)',
          infoPostFix: '',
          loadingRecords: 'Carregando...',
          zeroRecords: 'Nenhum registro encontrado.',
          emptyTable: 'Nenhum registro para mostrar.',
          paginate: {
            previous: 'Anterior',
            next: 'Próximo',
            first: 'Primeiro',
            last: 'Último'
          },
          aria: {
            sortAscending: ': Ordenar colunas de forma ascendente',
            sortDescending: ': Ordenar colunas de forma descendente'
          }
        }
      })
    });
  }

  componentWillUnmount() {
    this.state
        .table
        .destroy(true);
  }

  render() {
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center" ref={(el) => { this.el = el; }}>
          {this.props.header && (
            <thead>
              <tr>
                <th />     
                {this.props.columns.map((column, index) => {
                  return (
                    <th scope="col" key={index}>{column.title}</th>
                  );
                })}
              </tr>
            </thead>
          )}        
          <tbody>
            {this.props.data.map((data, index) => {
              return (
                <tr key={index}>
                  <td><Form.Check type="radio" value={data.id} name="id" /></td>
                  {this.props.columns.map((column, id) => {
                    return (<td key={id}>{
                      (column.name === 'price' ? 'R$' : '') + data[column.name]
                    }</td>);
                  })}
                </tr>
              );
            })}
          </tbody>
          {this.props.footer && (
            <tfoot>
              <tr>
                <th />
                {this.props.columns.map((column, index) => {
                  return (
                    <th scope="col" key={index}>{column.title}</th>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
  }
}