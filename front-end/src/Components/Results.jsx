import React, {Component} from 'react';
import Result from "./Result";

class Results extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="clearfix"></div>
        <div className='output_container'>
          <h3>Results</h3>
          <table>
            <thead>
            <tr>
              <th>#</th>
              <th>URL</th>
              <th>CODE</th>
              <th>TIME</th>
            </tr>
            </thead>
            <tbody>
              { this.props.data.map((result, i) => {
                return <Result data={result} num={i+1} key={i}/>;
              }) }
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default Results;