import React from 'react';
import {withStyles} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";


const CustomTableCell = withStyles(theme => ({

}))(TableCell);

const styles = theme => ({
  row:{
    '&:nth-child(odd)': {
      backgroundColor: `#a0a0a0`
    }
  },
  index: {
    width: `50px`,
    paddingLeft: `0`,
    paddingRight: `0`,
  },
});

function Error(props) {
  const {classes} = props;
  return (
    <React.Fragment>
      <TableRow className={classes.row}>
        <CustomTableCell className={classes.index}>{props.num}</CustomTableCell>
        <CustomTableCell>{props.data}</CustomTableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default withStyles(styles)(Error);
