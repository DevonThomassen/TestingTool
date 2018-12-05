import React, {Component} from 'react';
import Error from "./Error";

class Errors extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="clearfix"/>
        <div className='output_container'>
          <h3>Errors</h3>
          <table id='errors'>
            <thead>
            <tr>
              <th>#</th>
              <th>ERROR</th>
            </tr>
            </thead>
            <tbody>
            {this.props.data.map((result, i) => {
              return <Error data={result} num={i + 1} key={i}/>;
            })}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default Errors;
