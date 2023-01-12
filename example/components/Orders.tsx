import * as React from 'react';
import {useEffect, useState, useRef} from 'react';

interface Props {

}

export const Orders : React.FC<Props> = props => {
    const didMountRef = useRef(false);

    useEffect(() => {
        if(!didMountRef.current) {
            didMountRef.current = true;
        }
    }, []);

    return <>
        <h1>Orders</h1>
    </>
};
