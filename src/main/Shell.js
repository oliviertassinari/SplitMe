// @flow weak

import React from 'react';
import LayoutAppBar from 'main/layout/AppBar';
import LayoutBody from 'main/layout/Body';
import LayoutHeader from 'main/layout/Header';

const Shell = () => (
  <div>
    <LayoutHeader>
      <LayoutAppBar showMenuIconButton={false} />
    </LayoutHeader>
    <LayoutBody />
  </div>
);

export default Shell;
