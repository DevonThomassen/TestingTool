import * as React from 'react';
import CMetrics from '../classes/Metrics';
import CResult from '../classes/Result';
import Errors from './Errors';
import Overview from './Overview';
import Results from './Results';

interface State {
  results: CResult[];
  errors: string[];
  metrics: CMetrics;
}

class Input extends React.Component<{}, State> {

  public state: State = { // readonly?
    results: [],
    errors: [],
    metrics: {
      url: 'http://example.org/sitemap.xml',
      time: 0,
      results: 0,
      errors: 0
    }
  }

  apiRequest = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const $ = (id: string) => {
      return (document.getElementById(id) as HTMLInputElement);
    };
    // const url = (document.getElementById('url')as HTMLInputElement)!.value;
    const url = $('url').value;
    const user = $('user').value;
    const pass = $('pass').value;

    $('loader').style.display = 'block';

    const apiUrl = encodeURI(`http://localhost:8000?url=${url}&user=${user}&pass=${pass}`);
    console.log(apiUrl);

    const self = this;
    const startTime = new Date().getTime();
    const xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        const requestTime = new Date().getTime() - startTime;

        self.setState({
          results: data.results,
          errors: data.errors,
          metrics: {
            url,
            time: requestTime,
            results: data.results.length,
            errors: data.errors.length
          }
        });
        $('loader').style.display = 'none';
      } else {
        console.log(`XHR status: ${xhr.status}`);
      }
    };
    xhr.onerror = () => {
      console.error(`Can't reach the API`);
      console.log(`XHR status: ${xhr.status}`);
      $('loader').style.display = 'none';
    };
    xhr.send();
  }

  public render() {
    return (
      <React.Fragment>
        <div id='loader' />
        <div className='input_container'>
          <form onSubmit={this.apiRequest}>
            <label>URL: </label><br />
            <input id='url' type='text' placeholder='Required' /> <br />
            <label>Username: </label><br />
            <input id='user' type='text' /><br />
            <label>Password: </label><br />
            <input id='pass' type='password' /><br />
            <input type='submit' value='Get data' />
          </form>
        </div>
        <Overview metrics={this.state.metrics} />
        <Errors errors={this.state.errors} />
        <Results results={this.state.results} />
      </React.Fragment>
    );
  }
}

export default Input;
