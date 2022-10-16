import React, { useState, useEffect, useCallback } from 'react';

export function useLongPress(
    touchCallback?: (e: React.TouchEvent<HTMLDivElement>) => void,
    mouseCallback?: (e: React.MouseEvent<HTMLDivElement>) => void,
    ms = 300
) {
    const [mousePress, setMousePress] = useState<null | React.MouseEvent<HTMLDivElement>>(null);
    const [touchPress, setTouchPress] = useState<null | React.TouchEvent<HTMLDivElement>>(null);

    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;
        if (mousePress && mouseCallback) {
            timerId = setTimeout(() => mouseCallback(mousePress), ms);
        } else {
            clearTimeout(timerId);
        }
        let timerId2: NodeJS.Timeout | undefined;
        if (touchPress && touchCallback) {
            timerId = setTimeout(() => touchCallback(touchPress), ms);
        } else {
            clearTimeout(timerId2);
        }

        return () => {
            clearTimeout(timerId);
            clearTimeout(timerId2);
        };
    }, [mouseCallback, ms, mousePress]);

    return {
        onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => setMousePress(e),
        onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => setMousePress(null),
        onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => setMousePress(null),
        onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => setTouchPress(e),
        onTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => setTouchPress(null),
    };
}
