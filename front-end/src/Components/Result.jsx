import React, {Component} from 'react';

class Result extends Component {
  render() {
    return (
      <React.Fragment>
        <a className="row" title={this.props.data.url} href={"data:text/plain;base64," + btoa(this.props.data.body)} target={"_blank"}>
          <div className="cell">{this.props.data.num}</div>
          <div className="cell">{this.props.data.url}</div>
          <div className={"cell " + (this.props.data.statusCode === 200 ? 'good' : 'bad')}>{this.props.data.statusCode}</div>
          <div className="cell ms">{this.props.data.milliseconds}</div>
        </a>
      </React.Fragment>
    );
  }
}

export default Result;
