// @flow weak

import React, {PropTypes} from 'react';
import pure from 'recompose/pure';
import DocumentTitle from 'react-document-title';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import {Link} from 'react-router';
import polyglot from 'polyglot';
import ViewContainer from 'modules/components/ViewContainer';
import LayoutAppBar from 'modules/components/LayoutAppBar';
import LayoutBody from 'modules/components/LayoutBody';
import TextIconError from 'modules/components/TextIconError';

const styleSheet = createStyleSheet('NotFoundNotFound', () => ({
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
}));

const NotFound = (props, context) => {
  const classes = context.styleManager.render(styleSheet);

  return (
    <ViewContainer>
      {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') &&
        <DocumentTitle title={polyglot.t('page_not_found')} />
      }
      <LayoutAppBar
        title={
          <Link to="/" className={classes.link}>
            {'SplitMe'}
          </Link>
        }
        showMenuIconButton={false}
      />
      <LayoutBody>
        <TextIconError text={polyglot.t('page_not_found')} />
      </LayoutBody>
    </ViewContainer>
  );
};

NotFound.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default pure(NotFound);
