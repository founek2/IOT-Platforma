import { useState, useEffect } from 'react';

export function useLongPress(
    mouseCallback: (e: React.MouseEvent<HTMLDivElement>) => void,
    touchCallback: (e: React.TouchEvent<HTMLDivElement>) => void,
    ms = 300
) {
    const [mousePress, setMousePress] = useState<null | React.MouseEvent<HTMLDivElement>>(null);
    const [touchPress, setTouchPress] = useState<null | React.TouchEvent<HTMLDivElement>>(null);

    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (mousePress) {
            timerId = setTimeout(() => mouseCallback(mousePress), ms);
        } else {
            // @ts-ignore
            clearTimeout(timerId);
        }
        let timerId2: NodeJS.Timeout;
        if (touchPress) {
            timerId = setTimeout(() => touchCallback(touchPress), ms);
        } else {
            // @ts-ignore
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
