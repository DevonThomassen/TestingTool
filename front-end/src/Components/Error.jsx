import React, {Component} from 'react';

class Error extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="cell">{this.props.num}</div>
          <div className="cell">{this.props.data}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default Error;
