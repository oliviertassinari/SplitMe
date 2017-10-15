import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import DocumentTitle from 'react-document-title';
import { withStyles } from 'material-ui-next/styles';
import { Link } from 'react-router';
import polyglot from 'polyglot';
import ViewContainer from 'modules/components/ViewContainer';
import LayoutAppBar from 'modules/components/LayoutAppBar';
import LayoutBody from 'modules/components/LayoutBody';
import TextIconError from 'modules/components/TextIconError';

const styles = {
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
};

const NotFound = props => {
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

export default compose(pure, withStyles(styles))(NotFound);
