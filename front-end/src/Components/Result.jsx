import React, {Component} from 'react';

class Result extends Component {
  b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode('0x' + p1);
      }));
  }

  render() {
    return (
      <React.Fragment>
        <a className="row"
           title={this.props.data.url}
           href={this.props.data.body === undefined ? '' 
             : 'data:text/plain;base64,' + this.b64EncodeUnicode(this.props.data.body)}
           target={this.props.data.body === undefined ? '' : '_blank'}>
          <div className="cell">{this.props.data.num}</div>
          <div className="cell">{this.props.data.url}</div>
          <div
            className={"cell " + (Math.floor(this.props.data.statusCode / 100) === 2 ? 'good' : 'bad')}>
            {this.props.data.statusCode}</div>
          <div className="cell ms">{this.props.data.milliseconds}</div>
        </a>
      </React.Fragment>
    );
  }
}

export default Result;
