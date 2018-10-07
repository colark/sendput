import React from 'react';
import MyComponent from "./bloom-sign-in";
import Home from "./pages/home";


const App = ({ Shell, Router }) => {
  return (
    <Shell>
      <Router.Switch>
        <Home />
      </Router.Switch>
    </Shell>
  );
}

export default { app: App };
