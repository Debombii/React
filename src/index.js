import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import App from "./App";

const MainApp = () => {
  return (
    <Router>
      <Switch>
        <Route path="/MRG">
          <Redirect to="/template_MRG.html" />
        </Route>
        <Route path="/GERP">
          <Redirect to="/template_GERP.html" />
        </Route>
        <Route path="/RUBICON">
          <Redirect to="/template_Rubi.html" />
        </Route>
        <Route path="/" component={App} /> {/* Ruta principal */}
      </Switch>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MainApp />);
