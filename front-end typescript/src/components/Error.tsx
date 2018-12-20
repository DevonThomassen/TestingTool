import * as React from 'react';

interface Props {
  num: number;
  info: string;
}

interface State {
  nothing_yet: string
}

class Error extends React.Component<Props, State> {
  public render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="cell">{this.props.num}</div>
          <div className="cell">{this.props.info}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default Error;
