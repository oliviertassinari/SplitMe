import React from 'react';

import CanvasAppBar from 'main/canvas/AppBar';
import CanvasBody from 'main/canvas/Body';
import CanvasHead from 'main/canvas/Head';

const Shell = () => (
  <div>
    <CanvasHead>
      <CanvasAppBar showMenuIconButton={false} />
    </CanvasHead>
    <CanvasBody />
  </div>
);

export default Shell;
