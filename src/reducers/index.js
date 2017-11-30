import { combineReducers } from "redux";
import editor from "../Editor/ducks";
import results from "../Results/ducks";

export default combineReducers({ editor, results });
