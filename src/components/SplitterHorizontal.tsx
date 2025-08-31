/* eslint-disable react-hooks/exhaustive-deps */
import React, { Children, CSSProperties, MouseEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Splitter.less';
import { useDebounce } from './useDebounce';

interface IProps {
    children?: any;
    minSize?: number;
    style?: CSSProperties;
    splitterStyle?: CSSProperties;
    onSaveRatio?: (value: number) => void;
    initialRatio?: number;
}

export const SplitterHorizontal: React.FC<IProps> = ({
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

    const sizeInitialization = () => {
        let actualSize = splitterFirstRef.current.offsetWidth;
        if (initialRatio) {
            actualSize = window.innerWidth * initialRatio;
        }
        setSize(Math.max(actualSize, minSize));
    };

    useLayoutEffect(sizeInitialization, []);

    useEffect(
        () => {
            if (ready && onSaveRatio) {
                onSaveRatio(splitterFirstRef.current.offsetWidth / window.innerWidth);
            }
        },
        [debouncedSize]
    );

    const startMove = (event: MouseEvent<HTMLDivElement>) => {
        setCoord(event.clientX);
        setMoving(true);
    };

    const stopMove = () => setMoving(false);

    const moveHandler = useCallback((event: MouseEvent<HTMLDivElement>) => {
        if (!isMoving || !splitterFirstRef.current) return;

        const newSize = splitterFirstRef.current.offsetWidth + event.clientX - coord;
        setSize(Math.max(newSize, minSize || 0));
        setCoord(event.clientX);
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
                style={{ ...style, display: 'flex', flexDirection: 'row' }}
                onMouseMove={moveHandler}
                onMouseLeave={stopMove}
                onMouseUp={stopMove}
            >
                {/* =========================================== first panel */}
                <div ref={splitterFirstRef} style={{ width: size }}>
                    {inners[0]}
                </div>

                {/* =========================================== splitter */}
                <div
                    className="splitter horizontal"
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
