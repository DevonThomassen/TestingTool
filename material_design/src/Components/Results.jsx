import React from 'react';
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

const styles = theme => ({
  index: {
    width: `50px`,
    padding: `4px 0px 4px 24px`
  }
});

function Results(props) {
  const {classes} = props;
  return (
    <React.Fragment>
      <div className="clearfix"/>
      <div className='output_container'>
        <h3>Results</h3>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell className={classes.index}>#</CustomTableCell>
                <CustomTableCell>URL</CustomTableCell>
                <CustomTableCell>Code</CustomTableCell>
                <CustomTableCell>TIME</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.map((result) => {
                return <Result data={result} key={'Result' + result.num}/>;
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </React.Fragment>
  )
}

export default withStyles(styles)(Results);
