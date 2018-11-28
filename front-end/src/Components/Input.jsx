import React, {Component} from 'react';
import Result from "./Result";
import Overview from "./Overview";

class Input extends Component {
  render() {
    function main() {
      // TODO: This...
      let url = document.getElementById('url').value;
      let user = document.getElementById('user').value;
      let pass = document.getElementById('pass').value;
      let complete = encodeURI(`http://localhost:8000?url=${url}&user=${user}&pass=${pass}`);
      console.log(complete);
      const xhr = new XMLHttpRequest();
      xhr.open('GET', complete);
      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log(JSON.parse(xhr.responseText));
        } else console.log(xhr.status);
      };;
      xhr.send();
    }

    return (
      <React.Fragment>
        <div className='input_container'>
          <label>URL: </label><br/>
          <input id='url' type='text'/>
          <label>Username: </label><br/>
          <input id='user' type='text'/><br/>
          <label>Password: </label><br/>
          <input id='pass' type='password'/><br/>
          <button onClick={main}>Get data</button>
        </div>
        <div className='results_container'>
          <table>
            <thead>
            <tr>
              <th colSpan="2">
                Results
              </th>
            </tr>
            </thead>
            <tbody>
            {/*TODO: Make Overview table in component*/}
            <Overview />
            </tbody>
          </table>
        </div>
        <div className="clearfix"></div>
        <div className='output_container'>
          <h3>Results</h3>
          <table>
            <thead>
            <tr>
              <th>#</th>
              <th>URL</th>
              <th>CODE</th>
              <th>TIME</th>
            </tr>
            </thead>
            <tbody>
            {/*TODO: table generator on items*/}
            <Result />
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default Input;