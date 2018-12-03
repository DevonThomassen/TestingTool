import React, {Component} from 'react';

class Overview extends Component {
  render() {
    return (
      <React.Fragment>
        <div className='results_container'>
          <table>
            <thead>
            <tr>
              <th colSpan="2">Results</th>
            </tr>
            </thead>
            <tbody>
              <tr>
                <td>Url</td>
                <td>{this.props.data.url}</td>
              </tr>
              <tr>
                <td>Time</td>
                <td>{this.props.data.time}ms</td>
              </tr>
              <tr>
                <td>Pages</td>
                <td>{this.props.data.results}</td>
              </tr>
              <tr>
                <td>Errors</td>
                <td>{this.props.data.errors}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default Overview;
