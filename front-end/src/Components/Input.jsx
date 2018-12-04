import React, {Component} from 'react';
import Errors from "./Errors";
import Results from "./Results";
import Overview from "./Overview";

class Input extends Component {

  state = {
    results: [],
    errors: [],
    metrics: {
      url: 'http://example.org/sitemap.xml',
      time: 0,
      results: 0,
      errors: 0,
    }
  }

  apiRequest = () => {
    const $ = function (id) {
      return document.getElementById(id)
    };
    let url = $('url').value;
    let user = $('user').value;
    let pass = $('pass').value;
    $('loader').style.display = 'block';
    let apiUrl = encodeURI(`http://localhost:8000?url=${url}&user=${user}&pass=${pass}`);
    console.log(apiUrl);
    let self = this;
    let start_time = new Date().getTime();
    const xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl);
    xhr.onload = function () {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        let request_time = new Date().getTime() - start_time;

        self.setState({
          results: data.results,
          errors: data.errors,
          metrics: {
            url: url,
            time: request_time,
            results: data.results.length,
            errors: data.errors.length
          }
        });
        $('loader').style.display = 'none';
      } else console.log(JSON.parse(xhr.status));
    };
    xhr.send();
  }

  render() {
    return (
      <React.Fragment>
        <div id='loader'></div>
        <div className='input_container'>
          <label>URL: </label><br/>
          <input id='url' type='text'/>
          <label>Username: </label><br/>
          <input id='user' type='text'/><br/>
          <label>Password: </label><br/>
          <input id='pass' type='password'/><br/>
          <button onClick={this.apiRequest}>Get data</button>
        </div>
        <Overview data={this.state.metrics}/>
        <Errors data={this.state.errors}/>
        <Results data={this.state.results}/>
      </React.Fragment>
    );
  }
}

export default Input;
