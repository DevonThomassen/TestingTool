import React, {Component} from 'react';

class Input extends Component {
  render() {
    return (
      <React.Fragment>
        <h1>Connected</h1>
        // TODO: Style
        <div className='container_left'>
          <label>Username: </label>
          <input id='user' type='text'/>
          <br/>
          <label>Password: </label>
          <input id='pass' type='password'/>
        </div>
        <div className='container_right'>
          <label>URL: </label>
          <input id='url' type='text'/>
        </div>
        <button onClick={() => {
          // TODO: Clean up
          let url = document.getElementById('url').value;
          let user = document.getElementById('user').value;
          let pass = document.getElementById('pass').value;
          let complete = encodeURI(`http://localhost:8000?url=${url}&user=${user}&pass=${pass}`);
          document.getElementById('pre').value = complete;
          console.log(complete)
          const xhr = new XMLHttpRequest();
          xhr.open('GET', complete);
          xhr.onload = function () {
            if (xhr.status === 200) console.log(JSON.parse(xhr.responseText));
            else console.log(xhr.status);
          };
          xhr.send();
        }}>Get data
        </button>
        <pre id='pre'>protocol://host.com/pathname</pre>
      </React.Fragment>
    );
  }
}

export default Input;
