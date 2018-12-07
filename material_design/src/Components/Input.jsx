import React from 'react';
import Overview from "./Overview";
import Errors from "./Errors";
import Results from "./Results";
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});

class Input extends React.Component {
  state = {
    results: [],
    errors: [],
    metrics: {
      url: 'http://example.org/sitemap.xml',
      time: 0,
      results: 0,
      errors: 0,
    }
  };

  apiRequest = (evt) => {
    evt.preventDefault();

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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const {classes} = this.props;

    return (
      <React.Fragment>
        <div id='loader'/>
        <div className='input_container'>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              id='url'
              required
              label="Url"
              className={classes.textField}
              margin="normal"
              fullWidth
            />
            <TextField
              id='user'
              label="Username"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
              fullWidth
            />
            <TextField
              id='pass'
              label="Password"
              className={classes.textField}
              type="password"
              autoComplete="current-password"
              margin="normal"
              fullWidth
            />
            <Button onClick={this.apiRequest} variant="contained" color="primary" className={classes.button} fullWidth>
              Send
              <Icon className={classes.rightIcon}>send</Icon>
            </Button>
          </form>
        </div>
        <Overview data={this.state.metrics}/>
        <Errors data={this.state.errors}/>
        <Results data={this.state.results}/>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Input);