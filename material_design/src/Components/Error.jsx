import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

const CustomTableCell = TableCell;

const styles = () => ({
  row: {
    '&:nth-child(even)': {
      backgroundColor: `#dbdbdb`
    }
  },
  index: {
    width: `50px`,
    paddingLeft: `0`,
    paddingRight: `0`,
  },
});

class Error extends Component {
  render() {
    const {classes} = this.props;
    return (
      <React.Fragment>
        <TableRow className={classes.row}>
          <CustomTableCell className={classes.index}>{this.props.num}</CustomTableCell>
          <CustomTableCell>{this.props.data}</CustomTableCell>
        </TableRow>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Error);
