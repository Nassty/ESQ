import { createStore, compose, applyMiddleware } from "redux";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunkMiddleware from "redux-thunk";

import rootReducer from "./reducers";

const getStore = initialState => {
  const isProduction = process.env.NODE_ENV === "production";

  const devMiddlewares = [reduxImmutableStateInvariant()];

  const middlewares = [thunkMiddleware];

  let store;
  if (isProduction) {
    store = createStore(
      rootReducer,
      initialState,
      compose(applyMiddleware(...middlewares))
    );
  } else {
    const allMiddlewares = middlewares.concat(devMiddlewares);
    store = createStore(
      rootReducer,
      initialState,
      composeWithDevTools(applyMiddleware(...allMiddlewares))
    );
  }

  if (!isProduction && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./reducers", () => {
      const nextReducer = require("./reducers").default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
};

export { getStore };
