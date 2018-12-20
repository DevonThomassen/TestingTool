import * as React from 'react';

interface Props {
  text: string;
  age?: string;
}

interface State {
  username: string;
  password: string;
}

class Test extends React.Component<Props, State> {

  state: State = {
    username: "dwed",
    password: "dwed",
  }

  public render() {
    return (
      <div>
        <h1>Hallo</h1>
        <h2>{this.props.text}</h2>
        <h2>{this.state.username}</h2>
        <h2>{this.state.password}</h2>
      </div>
    );
  }
}

export default Test;
