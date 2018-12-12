import React, {Component} from 'react';
import Result from "./Result";
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = () => ({
  index: {
    width: `50px`,
    padding: `4px 0 4px 24px`,
  },

  item: {
    padding: `4px 24px`,
    width: `50px`,
    textAlign: `center`
  }
});


class Results extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orderProperty: 'num',
      orderAscending: true
    };
  }

  toggleOrderProperty = (propertyName) => {
    if (this.state.orderProperty === propertyName) {
      this.setState({
        orderProperty: this.state.orderProperty,
        orderAscending: !this.state.orderAscending
      });
    } else {
      this.setState({
        orderProperty: propertyName,
        orderAscending: true
      });
    }
  };

  toggleSortByNum = () => {
    this.toggleOrderProperty('num');
  };

  toggleSortByUrl = () => {
    this.toggleOrderProperty('url');
  };

  toggleSortByCode = () => {
    this.toggleOrderProperty('statusCode');
  };

  toggleSortByTime = () => {
    this.toggleOrderProperty('milliseconds');
  };

  orderFn = (resultA, resultB) => {
    if (this.state.orderAscending) {
      return resultA[this.state.orderProperty] > resultB[this.state.orderProperty];
    } else {
      return resultA[this.state.orderProperty] < resultB[this.state.orderProperty];
    }
  };

  render() {
    const {classes} = this.props;
    return (
      <React.Fragment>
        <div className="clearfix"/>
        <div className='output_container'>
          <h3>Results</h3>
          <Paper className={classes.root}>
            <Table
              className={`${this.state.orderAscending ? 'ordered-ascending' : 'ordered-descending'}`}>
              <TableHead>
                <TableRow>
                  <CustomTableCell
                    className={`order ${classes.index} ${this.state.orderProperty !== 'num' ? '' : 'selected'}`}
                    onClick={this.toggleSortByNum}>#</CustomTableCell>
                  <CustomTableCell
                    className={`order ${this.state.orderProperty !== 'url' ? '' : 'selected'}`}
                    onClick={this.toggleSortByUrl}>URL</CustomTableCell>
                  <CustomTableCell
                    className={`order ${classes.item} ${this.state.orderProperty !== 'statusCode' ? '' : 'selected'}`}
                    onClick={this.toggleSortByCode}>CODE</CustomTableCell>
                  <CustomTableCell
                    className={`order ${classes.item} ${this.state.orderProperty !== 'milliseconds' ? '' : 'selected'}`}
                    onClick={this.toggleSortByTime}>TIME</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.data.sort(this.orderFn).map((result) => {
                  return <Result data={result} key={'Result' + result.num}/>;
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Results);
