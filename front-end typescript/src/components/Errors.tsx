import * as React from 'react';
import Error from './Error';

interface Props {
  errors: string[];
}

class Errors extends React.Component<Props> {
  public render() {
    return (
      <React.Fragment>
        <div className="clearfix" />
        <div className='output_container'>
          <h3>Errors</h3>
          <div className="table" id='errors'>
            <div className="row">
              <div className="head">#</div>
              <div className="head">ERROR</div>
            </div>
            {this.props.errors.map((result, i) => {
              return <Error info={result} num={i + 1} key={i} />;
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Errors;
