import React from 'react';

const App = ({ Shell, Router }) => {
  return (
    <Shell>
      <Router.Switch>
        <Router.Route path="/" component={() => "hi!"} />
      </Router.Switch>
    </Shell>
  );
}

export default { app: App };
