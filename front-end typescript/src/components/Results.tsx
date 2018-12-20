import * as React from 'react';
import { IfResult } from './IfResult';
import Result from './Result';

interface Props {
  results: IfResult[];
}

interface State {
  orderProperty: string;
  orderAscending: boolean;
}

class Results extends React.Component<Props, State> {

  state: State = {
    orderProperty: 'num',
    orderAscending: true
  }

  toggleOrderProperty = (propertyName: string) => {
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

  orderFn = (resultA: IfResult, resultB: IfResult) : number => {
    const order = this.state.orderAscending ? 1 : -1
    
    return resultA[this.state.orderProperty] > resultB[this.state.orderProperty] ? order : -order;
  };

  public render() {
    console.log(this.state);
    return (
      <React.Fragment>
        <div className="clearfix" />
        <div className='output_container'>
          <h3>Results</h3>
          <div id='results' className={"table " + (this.state.orderAscending ? 'ordered-ascending' : 'ordered-descending')}>
            <div className="row">
              <div className={"head order " + (this.state.orderProperty !== 'num' ? '' : 'selected')}
                onClick={this.toggleSortByNum}>#</div>
              <div className={"head order " + (this.state.orderProperty !== 'url' ? '' : 'selected')}
                onClick={this.toggleSortByUrl}>URL</div>
              <div className={"head order " + (this.state.orderProperty !== 'statusCode' ? '' : 'selected')}
                onClick={this.toggleSortByCode}>CODE</div>
              <div className={"head order " + (this.state.orderProperty !== 'milliseconds' ? '' : 'selected')}
                onClick={this.toggleSortByTime}>TIME</div>
            </div>
            {this.props.results.sort(this.orderFn).map((result: IfResult) => {
              return <Result result={result} key={'Result' + result.num} />;
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Results;
