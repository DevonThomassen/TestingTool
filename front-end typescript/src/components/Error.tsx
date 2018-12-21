import * as React from 'react';

interface Props {
  num: number;
  info: string;
}

class Error extends React.Component<Props> {
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
