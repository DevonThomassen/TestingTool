import React, {Component} from 'react';
import Error from "./Error";

class Errors extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="clearfix"/>
        <div className='output_container'>
          <h3>Errors</h3>
          <div className="table" id='errors'>
            <div className="row">
              <div className="head">#</div>
              <div className="head">ERROR</div>
            </div>
            {this.props.data.map((result, i) => {
              return <Error data={result} num={i + 1} key={i}/>;
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Errors;
