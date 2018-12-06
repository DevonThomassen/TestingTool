import React, {Component} from 'react';

class Error extends Component {
  render() {
    return (
      <React.Fragment>
        <tr>
          <td>{this.props.num}</td>
          <td>{this.props.data}</td>
        </tr>
      </React.Fragment>
    );
  }
}

export default Error;
