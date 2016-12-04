// @flow weak

import React, { PropTypes } from 'react';
import ViewContainer from 'modules/components/ViewContainer';
import LayoutAppBar from 'modules/components/LayoutAppBar';

const Shell = (props) => (
  <ViewContainer>
    <LayoutAppBar showMenuIconButton={false} />
    {props.children}
  </ViewContainer>
);

Shell.propTypes = {
  children: PropTypes.node,
};

export default Shell;
