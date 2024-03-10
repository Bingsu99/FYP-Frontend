import React from 'react';
import {useDroppable} from '@dnd-kit/core';

function Droppable({children, id, cssStyle}) {
    //  When a draggable element is moved over your droppable element, the isOver property will become true.
    const {isOver, setNodeRef} = useDroppable({
        id: id,
    });
    const style = {
        color: isOver ? 'green' : undefined,
    };
    
    
    return (
        <div ref={setNodeRef} className={cssStyle}>
            {children}
        </div>
    );
}

export default Droppable;