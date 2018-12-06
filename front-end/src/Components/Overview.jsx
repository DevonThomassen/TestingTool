import React, {Component} from 'react';

class Overview extends Component {
  render() {
    return (
      <div className='results_container'>
        <div className="table">
          <div className="row">
            <div className="head" style={{colspan: 2}}>Results</div>
          </div>
          <div className="row">
            <div className="cell">Url</div>
            <div className="cell">{this.props.data.url}</div>
          </div>
          <div className="row">
            <div className="cell">Time</div>
            <div className="cell ms">{this.props.data.time}</div>
          </div>
          <div className="row">
            <div className="cell">Pages</div>
            <div className="cell">{this.props.data.results}</div>
          </div>
          <div className="row">
            <div className="cell">Errors</div>
            <div className="cell">{this.props.data.errors}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Overview;
