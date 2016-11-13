// @flow weak

import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import DocumentTitle from 'react-document-title';
import { createStyleSheet } from 'jss-theme-reactor';
import { Link } from 'react-router';
import polyglot from 'polyglot';
import withStyles from 'material-ui-build-next/src/styles/withStyles';
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

const NotFound = (props) => {
  const classes = props.classes;

  return (
    <ViewContainer>
      {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') && (
        <DocumentTitle title={polyglot.t('page_not_found')} />
      )}
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

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  pure,
  withStyles(styleSheet),
)(NotFound);
