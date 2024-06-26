import React from 'react';
import {useDraggable} from '@dnd-kit/core';

function Draggable({children, id, cssStyle}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={cssStyle}>
      {children}
    </div>
  );
}

export default Draggable;