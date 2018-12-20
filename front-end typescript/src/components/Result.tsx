import * as React from 'react';
import { IfResult } from './IfResult';


interface Props {
  result: IfResult;
}

interface State {
  nothing_yet: string
}

class Result extends React.Component<Props, State> {
  public render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="cell">{this.props.result.num}</div>
          <div className="cell">{this.props.result.url}</div>
          <div className={"cell " + (Math.floor(this.props.result.statusCode / 100) === 2 ? 'good' : 'bad')}>
            {this.props.result.statusCode}</div>
          <div className="cell ms">{this.props.result.milliseconds}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default Result;
