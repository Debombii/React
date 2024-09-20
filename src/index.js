import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";
import TestPage from "./TestPage"; // Importa tu nuevo componente para el subdominio

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/Test" component={TestPage} />
        <Route path="/" component={ChangelogGenerator} /> {/* Ruta principal */}
      </Switch>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
