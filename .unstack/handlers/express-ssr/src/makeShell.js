import React from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import { Route, Switch } from 'react-router';
import Shell from './shell';
import gql from 'graphql-tag';


const ROUTE_TO_PAGE = gql`
  {
    router(path: "/hello")
  }
`;

const PageFetcher = (props) => (<Query query={ROUTE_TO_PAGE}>
  {({ loading, error, data }) => {
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    const page = JSON.parse(data.router);
    console.log(page.componentName)
    const LoadedPage = props.component //loadComponent(page.componentName);

    return <LoadedPage {...page.data} {...props} />
  }}
</Query>);

export default (App, { apolloClient }) => {
  const Apollo = { Query };
  const ConnectedRoute = routeProps => {
    const ConnectedComponent = (componentProps) => {
      return (<PageFetcher {...componentProps} {...routeProps} Apollo={Apollo} />);
    }
    return <Route
      {...routeProps}
      exact
      component={ConnectedComponent}
    />
  }
  return <Route path="/" component={(props) => {
    return (
      <ApolloProvider client={apolloClient}>
        <App {...props} Shell={Shell} Router={{ Route: ConnectedRoute, Switch }} Apollo={{ Query }} />
      </ApolloProvider>
    )
  }} />
}
