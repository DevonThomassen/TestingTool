import React, {Component} from 'react';

class Result extends Component {
  render() {
    return (
      <React.Fragment>
        <tr>
          <td>{this.props.num}</td>
          <td>{this.props.data.url}</td>
          <td className={(this.props.data.statusCode === 200 ? 'good' : 'bad')}>{this.props.data.statusCode}</td>
          <td>{this.props.data.milliseconds}ms</td>
        </tr>
      </React.Fragment>
    );
  }
}

export default Result;
