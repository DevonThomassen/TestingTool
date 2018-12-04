import React, {Component} from 'react';

class Error extends Component {
  render() {
    console.log(this.props);
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
