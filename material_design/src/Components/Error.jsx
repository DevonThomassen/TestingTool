import React, {Component} from 'react';
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import {withStyles} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";


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

function Error(props) {
  const {classes} = props;

  return (
    <React.Fragment>
      <TableRow>
        <CustomTableCell>{props.num}</CustomTableCell>
        <CustomTableCell>{props.data}</CustomTableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default Error;