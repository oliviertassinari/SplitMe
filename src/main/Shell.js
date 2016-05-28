import React from 'react';
import AppBar from 'material-ui-build/src/AppBar';

import CanvasHead from 'main/canvas/Head';
import CanvasBody from 'main/canvas/Body';

const Shell = () => (
  <div>
    <CanvasHead>
      <AppBar showMenuIconButton={false} />
    </CanvasHead>
    <CanvasBody />
  </div>
);

export default Shell;
