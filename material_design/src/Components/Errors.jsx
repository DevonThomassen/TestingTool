import React from 'react';
import Error from './Error'
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
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

function Errors(props) {
  const {classes} = props;

  return (
    <React.Fragment>
      <div className="clearfix"/>
      <div className='output_container'>
        <h3>Errors</h3>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell>#</CustomTableCell>
                <CustomTableCell>Errors</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.map((result, i) => {
                return <Error data={result} num={i + 1} key={i}/>;
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </React.Fragment>
  );
}

export default withStyles(styles)(Errors);