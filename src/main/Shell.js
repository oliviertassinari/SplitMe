// @flow weak

import React from 'react';
import ViewContainer from 'modules/components/ViewContainer';
import LayoutAppBar from 'modules/components/LayoutAppBar';

const Shell = () => (
  <ViewContainer>
    <LayoutAppBar showMenuIconButton={false} />
  </ViewContainer>
);

export default Shell;
