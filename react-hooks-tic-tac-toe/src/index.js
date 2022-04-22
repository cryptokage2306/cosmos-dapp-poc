import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Game from "./Game";
import "bootstrap/dist/css/bootstrap.css";
import * as serviceWorker from "./serviceWorker";
import { HashRouter, Route } from "react-router-dom";
import { Main } from "./Main";
import { JoinGame } from "./JoinGame";
ReactDOM.render(
  <HashRouter>
    <Route exact path="/" component={Main} />
    <Route exact path="/join-game" component={JoinGame} />
    <Route exact path="/game/:id" component={Game} />
  </HashRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
