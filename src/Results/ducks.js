import { combineReducers } from "redux";
import ElasticSearch from "elasticsearch";

const RESULTS = "got results from ES";
const LOADING = "elastic search is loading";
const ERROR = "elastic search failed";
const SET_URL = "set a new elastic search url";

const gotResults = results => ({ type: RESULTS, results });
const isLoading = { type: LOADING };
const gotError = error => ({ type: ERROR, error });

const getClient = url =>
  new ElasticSearch.Client({
    host: {
      protocol: url.protocol,
      host: url.host,
      port: url.port || 80,
      path: url.pathname,
      auth: `${url.username}:${url.password}`
    }
  });

const queryES = (dispatch, getState) => {
  dispatch(isLoading);
  try {
    const code = JSON.parse(getState().editor.code);
    const clientUrl = getState().results.config;
    new getClient(new URL(clientUrl))
      .search(code)
      .then(result => dispatch(gotResults(result)), e => dispatch(gotError(e)))
      .catch(e => dispatch(gotError(e)));
  } catch (e) {
    dispatch(gotError);
  }
};

const initialState = {
  results: [],
  loading: false,
  error: false,
  errorMessage: "",
  config: "http://admin:changeme@localhost:9200/es"
};

const loading = (state = initialState.loading, action) => {
  switch (action.type) {
    case LOADING:
      return true;
    case ERROR:
    case RESULTS:
      return false;
    default:
      return state;
  }
};

const error = (state = initialState.error, action) => {
  switch (action.type) {
    case ERROR:
      return true;
    case LOADING:
    case RESULTS:
      return false;
    default:
      return state;
  }
};

const errorMessage = (state = initialState.errorMessage, action) => {
  switch (action.type) {
    case ERROR:
      return action.error;
    case LOADING:
    case RESULTS:
      return "";
    default:
      return state;
  }
};

const results = (state = initialState.results, action) => {
  switch (action.type) {
    case LOADING:
    case ERROR:
      return initialState.results;
    case RESULTS:
      return action.results;
    default:
      return state;
  }
};

const config = (state = initialState.config, action) => {
  switch (action.type) {
    case SET_URL:
      return action.url;
    default:
      return state;
  }
};

const setUrl = url => ({type: SET_URL, url});

export { queryES, gotResults, setUrl };

export default combineReducers({
  results,
  loading,
  error,
  errorMessage,
  config
});
