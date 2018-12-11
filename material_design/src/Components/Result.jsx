import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import TableRow from '@material-ui/core/TableRow';
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
  item: {
    width: `50px`,
    padding: `4px 24px 4px 24px`,
    textAlign: `center`,

    '&:last-of-type': {
      textAlign: `right`,
    }
  }
});


class Result extends Component {
  
  b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode('0x' + p1);
      }));
  }

  render() {
    const {classes} = this.props;
    return (
      <React.Fragment>
        <TableRow className={`${classes.row} ${this.props.data.body === undefined ? 'image' : 'link'}`}
                  onClick={() => this.props.data.body === undefined ? ''
                    : window.open('data:text/plain;base64,' + this.b64EncodeUnicode(this.props.data.body))}>
          <CustomTableCell className={classes.index}>{this.props.data.num}</CustomTableCell>
          <CustomTableCell>{this.props.data.url}</CustomTableCell>
          <CustomTableCell
            className={`${classes.item} ${Math.floor(this.props.data.statusCode / 100) === 2 ? 'good' : 'bad'}`}>{this.props.data.statusCode}</CustomTableCell>
          <CustomTableCell className={'ms ' + classes.item}>{this.props.data.milliseconds}</CustomTableCell>
        </TableRow>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Result);
