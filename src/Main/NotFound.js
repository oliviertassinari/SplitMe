import React from 'react';
import pure from 'recompose/pure';
import AppBar from 'material-ui/src/app-bar';
import DocumentTitle from 'react-document-title';

import polyglot from 'polyglot';
import CanvasHead from 'Main/Canvas/Head';
import CanvasBody from 'Main/Canvas/Body';
import TextIcon from 'Main/TextIcon';

const NotFound = () => (
  <div>
    <DocumentTitle title={polyglot.t('page_not_found')} />
    <CanvasHead>
      <AppBar
        title="SplitMe"
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
