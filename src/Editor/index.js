import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "brace";
import AceSplitEditor from "react-ace/lib/split";

import "brace/mode/javascript";
import "brace/theme/terminal";
import "brace/keybinding/vim";

import "./style.css";
import { addCode } from "./ducks";
import { queryES, setUrl } from "../Results/ducks";

const Editor = ({
  code,
  results,
  onChange,
  onCommit,
  configure,
  configString,
  errorMessage
}) => (
  <AceSplitEditor
    orientation="beside"
    width={`${window.innerWidth}px`}
    height={`${window.innerHeight}px`}
    splits={2}
    value={[
      code,
      `// request to: ${configString}\n\n${errorMessage || results}`
    ]}
    mode="javascript"
    keyboardHandler="vim"
    theme="terminal"
    onChange={onChange}
    name="editor"
    editorProps={{ $blockScrolling: true }}
    commands={[
      {
        name: "commit",
        bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
        exec: onCommit
      },
      {
        name: "insert-config",
        bindKey: { win: "Ctrl-m", mac: "Command-m" },
        exec: () => configure(configString)
      }
    ]}
  />
);

Editor.propTypes = {
  code: PropTypes.string.isRequired,
  results: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onCommit: PropTypes.func.isRequired,
  configure: PropTypes.func.isRequired,
  configString: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired
};

export default connect(
  state => ({
    code: state.editor.code,
    results: JSON.stringify(state.results.results, null, 2),
    configString: state.results.config,
    errorMessage: Boolean(state.results.errorMessage) && JSON.stringify(state.results.errorMessage, null, 2) || ""
  }),
  dispatch => ({
    onChange: code => dispatch(addCode(code[0])),
    onCommit: () => dispatch(queryES),
    configure: () =>
      dispatch((dispatch, getState) => {
        const newUrl = prompt(
          "ElasticSearch parameter",
          getState().results.config
        );
        if (newUrl) {
          dispatch(setUrl(newUrl));
        }
      })
  })
)(Editor);
