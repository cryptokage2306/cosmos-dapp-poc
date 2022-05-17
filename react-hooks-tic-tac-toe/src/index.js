import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Game from "./Game";
import "bootstrap/dist/css/bootstrap.css";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { Main } from "./Main";
import { JoinGame } from "./JoinGame";
import { ViewGame } from "./ViewGame";
import {
  CREATE_GAME,
  GAME_BASE,
  GAME_SCREEN,
  JOIN_GAME_BY_ID,
  JOIN_GAME,
} from "./constant";
import { Header } from "./components/Header";
ReactDOM.render(
  <BrowserRouter>
    <div>
      <Header />
      <Switch>
        <Route exact path={CREATE_GAME}>
          <Main />
        </Route>
        <Route exact path={JOIN_GAME}>
          <JoinGame />
        </Route>
        <Route exact path={JOIN_GAME_BY_ID}>
          <JoinGame />
        </Route>
        <Route exact path={GAME_BASE}>
          <ViewGame />
        </Route>
        <Route exact path={GAME_SCREEN}>
          <Game />
        </Route>
      </Switch>
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
