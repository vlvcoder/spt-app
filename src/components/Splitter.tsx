/* eslint-disable react-hooks/exhaustive-deps */
import React, { Children, CSSProperties, MouseEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './Splitter.less';
import { useDebounce } from './useDebounce';

type Direction = 'horizontal' | 'vertical';

interface IProps {
    direction?: Direction;
    children?: any;
    minSize?: number;
    style?: CSSProperties;
    splitterStyle?: CSSProperties;
    onSaveRatio?: (value: number) => void;
    initialRatio?: number;
}

export const Splitter: React.FC<IProps> = ({
    direction = 'horizontal',
    children = null,
    minSize = 200,
    style = {},
    splitterStyle = {},
    onSaveRatio = undefined,
    initialRatio = undefined,
}) => {
    const [ready, setReady] = useState(false);
    const [size, setSize] = useState<number | undefined>(undefined);
    const [isMoving, setMoving] = useState(false);
    const [coord, setCoord] = useState<number>(0);

    const debouncedSize = useDebounce(size, 1000);

    const splitterFirstRef = useRef<any>(null);

    const getCurrentSize = useCallback(() => {
        return direction === 'horizontal' ?
            splitterFirstRef.current.offsetWidth
            : splitterFirstRef.current.offsetHeight;
    }, [direction]);

    const getWindowSize = useCallback(() => {
        return direction === 'horizontal' ?
            window.innerWidth
            : window.innerHeight;
    }, [direction]);
    
    const getPointerPosition = useCallback((event: MouseEvent<HTMLDivElement>) => {
        return direction === 'horizontal' ?
            event.clientX
            : event.clientY;
    }, [direction]);

    const firstPanelStyle = useMemo((): CSSProperties => (
        direction === 'horizontal' ? { width: size } : { height: size }
    ), [direction, size]);

    const boxStyle = useMemo((): CSSProperties => (
        direction === 'horizontal' ?
            { ...style, display: 'flex', flexDirection: 'row' }
            : { ...style, display: 'flex', flexDirection: 'column' }
    ), [direction, size]);

    const sizeInitialization = () => {
        if (!splitterFirstRef.current) return;

        let actualSize = getCurrentSize();
        if (initialRatio) {
            actualSize = getWindowSize() * initialRatio;
        }
        setSize(Math.max(actualSize, minSize));
    };

    useLayoutEffect(sizeInitialization, []);

    useEffect(
        () => {
            if (ready && onSaveRatio) {
                onSaveRatio(getCurrentSize() / getWindowSize());
            }
        },
        [debouncedSize]
    );

    const startMove = (event: MouseEvent<HTMLDivElement>) => {
        setCoord(getPointerPosition(event));
        setMoving(true);
    };

    const stopMove = () => setMoving(false);

    const moveHandler = useCallback((event: MouseEvent<HTMLDivElement>) => {
        if (!isMoving || !splitterFirstRef.current) return;

        const newSize = getCurrentSize() + getPointerPosition(event) - coord;
        setSize(Math.max(newSize, minSize || 0));
        setCoord(getPointerPosition(event));
        setReady(true);
        event.stopPropagation();
        event.preventDefault();
    }, [isMoving, coord, minSize]);

    if (!children) return null;
    const inners = Children.toArray(children);
    if (inners.length < 2) return children;

    return (
        <>
            <div
                className="splitter-box"
                style={boxStyle}
                onMouseMove={moveHandler}
                onMouseLeave={stopMove}
                onMouseUp={stopMove}
            >
                {/* =========================================== first panel */}
                <div ref={splitterFirstRef} style={firstPanelStyle}>
                    {inners[0]}
                </div>

                {/* =========================================== splitter */}
                <div
                    className={`splitter ${direction}`}
                    style={splitterStyle}
                    onMouseDown={startMove}
                    onMouseUp={stopMove}
                />

                {/* =========================================== second panel */}
                <div className="splitter-panel-second">
                    {inners[1]}
                </div>
            </div>
            {inners.slice(2)}
        </>
    );
};
