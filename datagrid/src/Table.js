import React from 'react';
import axios from 'axios';
import Form from "react-jsonschema-form";
import 'bootstrap/dist/css/bootstrap.css';
import './Table.css';
import Paper from '@material-ui/core/Paper';
import {
  PagingState,
  SortingState,
  CustomPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Loading } from '../../../theme-sources/material-ui/components/loading';
import { CurrencyTypeProvider } from '../../../theme-sources/material-ui/components/currency-type-provider';


const URL = 'https://js.devexpress.com/Demos/WidgetsGallery/data/orderItems';

const schema = {
  title: "Add New Record",
  type: "object",
  required: [],
  properties: {
    title: {type: "string", title: "Title"},
    content: {type: "string", title: "Content"}
  }
};

const auth = {
  auth: {
  username: process.env.REACT_APP_KINTO_USER,
  password: process.env.REACT_APP_KINTO_PASSWORD
}};


class InfoTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      columns: [
        { name: 'OrderNumber', title: 'Order #' },
        { name: 'OrderDate', title: 'Order Date' },
        { name: 'StoreCity', title: 'Store City' },
        { name: 'Employee', title: 'Employee' },
        { name: 'SaleAmount', title: 'Sale Amount' },
      ],
      currencyColumns: ['SaleAmount'],
      tableColumnExtensions: [
        { columnName: 'OrderNumber', align: 'right' },
        { columnName: 'SaleAmount', align: 'right' },
      ],
      rows: [],
      sorting: [{ columnName: 'StoreCity', direction: 'asc' }],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
    };

    this.changeSorting = this.changeSorting.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
  }


  componentDidMount() {
    this.getData();
  }

  // getData = () => {
  //   axios.get('http://localhost:8888/v1/buckets/default/collections/test-1/records', auth)
  //   .then((res) => {
  //     let rows = [];
  //     for (let i = 0; i < res.data.data.length; i++) {
  //       rows.push({
  //         row: i + 1,
  //         id: res.data.data[i].id,
  //         title: res.data.data[i].title,
  //         content: res.data.data[i].content
  //       });
  //     }
  //     this.setState({
  //       rows: rows
  //     });
  //   })
  //   .catch((err) => { console.log(err); })
  // }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  changeSorting(sorting) {
    this.setState({
      loading: true,
      sorting,
    });
  }

  changeCurrentPage(currentPage) {
    this.setState({
      loading: true,
      currentPage,
    });
  }

  changePageSize(pageSize) {
    const { totalCount, currentPage: stateCurrentPage } = this.state;
    const totalPages = Math.ceil(totalCount / pageSize);
    const currentPage = Math.min(stateCurrentPage, totalPages - 1);

    this.setState({
      loading: true,
      pageSize,
      currentPage,
    });
  }

  queryString() {
    const { sorting, pageSize, currentPage } = this.state;

    let queryString = `${URL}?take=${pageSize}&skip=${pageSize * currentPage}`;

    const columnSorting = sorting[0];
    if (columnSorting) {
      const sortingDirectionString = columnSorting.direction === 'desc' ? ' desc' : '';
      queryString = `${queryString}&orderby=${columnSorting.columnName}${sortingDirectionString}`;
    }

    return queryString;
  }

  loadData() {
    const queryString = this.queryString();
    if (queryString === this.lastQuery) {
      this.setState({ loading: false });
      return;
    }

    fetch(queryString)
      .then(response => response.json())
      .then(data => this.setState({
        rows: data.items,
        totalCount: data.totalCount,
        loading: false,
      }))
      .catch(() => this.setState({ loading: false }));
    this.lastQuery = queryString;
  }


  submitForm = ({formData}) => {
    axios.post('http://localhost:8888/v1/buckets/default/collections/test-1/records', {"data":formData}, auth)
      .then((res) => {
        this.getData();
      })
      .catch((err) => { console.log(err); })
  }

  render() {
    const {
      rows,
      columns,
      currencyColumns,
      tableColumnExtensions,
      sorting,
      pageSize,
      pageSizes,
      currentPage,
      totalCount,
      loading,
    } = this.state;
        return  (
      <div className="main">
        <Form schema={schema} onSubmit={this.submitForm} />
        <Paper style={{ position: 'relative' }}>
        <Grid
          rows={rows}
          columns={columns}
        >
          <CurrencyTypeProvider
            for={currencyColumns}
          />
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          <CustomPaging
            totalCount={totalCount}
          />
          <Table
            columnExtensions={tableColumnExtensions}
          />
          <TableHeaderRow showSortingControls />
          <PagingPanel
            pageSizes={pageSizes}
          />
        </Grid>
        {loading && <Loading />}
      </Paper>
      </div>
    )
  }
}

export default InfoTable;
