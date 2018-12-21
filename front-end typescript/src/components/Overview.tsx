import * as React from 'react';
import CMetrics from '../classes/Metrics';

interface Props {
  metrics: CMetrics;
}

class Overview extends React.Component<Props, {}> {
  public render() {
    return (
      <div className='results_container'>
        <div className="table">
          <div className="row">
            <div className="head">Results</div>
          </div>
          <div className="row">
            <div className="cell">Url</div>
            <div className="cell">{this.props.metrics.url}</div>
          </div>
          <div className="row">
            <div className="cell">Time</div>
            <div className="cell ms">{this.props.metrics.time}</div>
          </div>
          <div className="row">
            <div className="cell">Pages</div>
            <div className="cell">{this.props.metrics.results}</div>
          </div>
          <div className="row">
            <div className="cell">Errors</div>
            <div className="cell">{this.props.metrics.errors}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Overview;
