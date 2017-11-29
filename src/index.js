import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import { getStore } from "./store";

import "./index.css";
import Editor from './Editor';

const store = getStore();

render(
  <Provider store={store}>
    <Editor />
  </Provider>,
  document.querySelector("#app")
);
