import React, {Component} from 'react';
import Result from "./Result";

class Results extends Component {

  constructor(props) {
    super(props);

    this.state = {
      orderProperty: 'num',
      orderAscending: true
    };
  }

  toggleOrderProperty = (propertyName) => {
    if (this.state.orderProperty === propertyName) {
      this.setState({
        orderProperty: this.state.orderProperty,
        orderAscending: !this.state.orderAscending
      });
    } else {
      this.setState({
        orderProperty: propertyName,
        orderAscending: true
      });
    }
  };

  toggleSortByNum = () => {
    this.toggleOrderProperty('num');
  };

  toggleSortByUrl = () => {
    this.toggleOrderProperty('url');
  };

  toggleSortByCode = () => {
    this.toggleOrderProperty('statusCode');
  };

  toggleSortByTime = () => {
    this.toggleOrderProperty('milliseconds');
  };

  orderFn = (resultA, resultB) => {
    if (this.state.orderAscending) {
      return resultA[this.state.orderProperty] > resultB[this.state.orderProperty];
    } else {
      return resultA[this.state.orderProperty] < resultB[this.state.orderProperty];
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="clearfix"/>
        <div className='output_container'>
          <h3>Results</h3>
          <table id='results'>
            <thead>
            <tr>
              <th className={this.state.orderProperty !== 'num' || 'selected'} onClick={this.toggleSortByNum}>#</th>
              <th className={this.state.orderProperty !== 'url' || 'selected'} onClick={this.toggleSortByUrl}>URL</th>
              <th className={this.state.orderProperty !== 'statusCode' || 'selected'}
                  onClick={this.toggleSortByCode}>CODE
              </th>
              <th className={this.state.orderProperty !== 'milliseconds' || 'selected'}
                  onClick={this.toggleSortByTime}>TIME
              </th>
            </tr>
            </thead>
            <tbody>
            {this.props.data.sort(this.orderFn).map((result) => {
              return <Result data={result} key={'Result' + result.num}/>;
            })}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default Results;
