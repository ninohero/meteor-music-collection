var { Router, Route } = ReactRouter;

Routes = React.createClass({
  getInitialState() {
      return {}
  },
  render() {
    //    <Route component={Vote} path="/vote" />
    return (
      <Router history={ReactRouter.lib.BrowserHistory.history}>
        <Route component={App} path="/" />
      </Router>
    )
  }
})
