// @flow weak

import React, {PropTypes} from 'react';
import pure from 'recompose/pure';
import DocumentTitle from 'react-document-title';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import {Link} from 'react-router';
import polyglot from 'polyglot';
import LayoutHeader from 'main/layout/Header';
import LayoutBody from 'main/layout/Body';
import LayoutAppBar from 'main/layout/AppBar';
import TextIcon from 'modules/components/TextIcon';

const styleSheet = createStyleSheet('NotFoundNotFound', () => ({
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
}));

const NotFound = (props, context) => {
  const classes = context.styleManager.render(styleSheet);

  return (
    <div>
      <DocumentTitle title={polyglot.t('page_not_found')} />
      <LayoutHeader>
        <LayoutAppBar
          title={
            <Link to="/" className={classes.link}>
              {'SplitMe'}
            </Link>
          }
          showMenuIconButton={false}
        />
      </LayoutHeader>
      <LayoutBody>
        <TextIcon text={polyglot.t('page_not_found')} />
      </LayoutBody>
    </div>
  );
};

NotFound.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default pure(NotFound);
