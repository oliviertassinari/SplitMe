import React, {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import FlatButton from 'material-ui-build/src/FlatButton';
import {grey600} from 'material-ui-build/src/styles/colors';

import polyglot from 'polyglot';

const styles = {
  root: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    left: 0,
    textAlign: 'center',
    background: '#fff',
    borderTop: '1px solid #ccc',
  },
  button: {
    width: '100%',
    height: 50,
    color: grey600,
  },
};

class BottomButton extends Component {
  static propTypes = {
    onTouchTap: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div style={styles.root} data-test="BottomButton">
        <FlatButton label={polyglot.t('delete')} onTouchTap={this.props.onTouchTap} style={styles.button} />
      </div>
    );
  }
}

export default pure(BottomButton);
