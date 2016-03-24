import React from 'react';
import pure from 'recompose/pure';
import AppBar from 'material-ui/src/AppBar';
import DocumentTitle from 'react-document-title';
import {Link} from 'react-router';

import polyglot from 'polyglot';
import CanvasHead from 'main/canvas/Head';
import CanvasBody from 'main/canvas/Body';
import TextIcon from 'main/TextIcon';

const styles = {
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
};

const NotFound = () => (
  <div>
    <DocumentTitle title={polyglot.t('page_not_found')} />
    <CanvasHead>
      <AppBar
        title={<Link to="/" style={styles.link}>{'SplitMe'}</Link>}
        showMenuIconButton={false}
        data-test="AppBar"
      />
    </CanvasHead>
    <CanvasBody>
      <TextIcon text={polyglot.t('page_not_found')} />
    </CanvasBody>
  </div>
);

export default pure(NotFound);
