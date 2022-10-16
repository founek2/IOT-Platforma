import { logger } from 'common/src/logger/index';
import type { Identifier, XYCoord } from 'dnd-core';
import React, { useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

interface DragItem {
    id: string;
    index: number;
}

const ItemTypes = {
    CARD: 'CARD',
};

export interface DraggableComponentProps {
    id: string;
    index: number;
    onMove: (dragId: string, hoverId: string) => void;
    render: (isDraggin: boolean, ref: React.RefObject<HTMLDivElement>) => JSX.Element;
    type: string;
}
export function DraggableComponent({ id, index, onMove, render, type }: DraggableComponentProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
        accept: type,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            onMove(item.id, id);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type,
        item: () => {
            return { id, index };
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));
    return render(isDragging, ref);
}

export function Draggable({ dragDisabled, render, ...props }: DraggableComponentProps & { dragDisabled?: boolean }) {
    if (dragDisabled) return render(false, { current: null });

    return <DraggableComponent {...props} render={render} />;
}

const checkIfTouchScreen = () => matchMedia('(hover: none), (pointer: coarse)').matches;

export function DraggableProvider({ children }: { children: React.ReactElement | React.ReactElement[] }) {
    const [isTouchScreen, setIsTouchScreen] = React.useState(checkIfTouchScreen());
    React.useEffect(() => {
        function handleResize() {
            setIsTouchScreen(checkIfTouchScreen());
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (isTouchScreen) {
        logger.info('Using TouchBackend');
        return <DndProvider backend={TouchBackend}>{children}</DndProvider>;
    }

    logger.info('Using HTML5Backend');
    return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}
