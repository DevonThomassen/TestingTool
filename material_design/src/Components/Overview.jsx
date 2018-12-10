import React from 'react';
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

    '&:first-child': {
      padding: `4px 0px 4px 24px`
    },
  },
}))(TableCell);

const styles = theme => ({

});

function Overview(props) {
  const {classes} = props;
  return (
    <div className='results_container'>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell colSpan={2}>Results</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <CustomTableCell>
                Url
              </CustomTableCell>
              <CustomTableCell>{props.data.url}</CustomTableCell>
            </TableRow>
            <TableRow>
              <CustomTableCell>
                Time
              </CustomTableCell>
              <CustomTableCell className='ms'>{props.data.time}</CustomTableCell>
            </TableRow>
            <TableRow>
              <CustomTableCell>
                Pages
              </CustomTableCell>
              <CustomTableCell>{props.data.results}</CustomTableCell>
            </TableRow>
            <TableRow>
              <CustomTableCell>
                Errors
              </CustomTableCell>
              <CustomTableCell>{props.data.errors}</CustomTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default withStyles(styles)(Overview);
