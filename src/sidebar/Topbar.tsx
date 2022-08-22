import React, {useEffect, useRef} from 'react';
import bars from './icons/bars-solid.svg';

import './topbar.css'

interface Props {
    onSidebarToggle: () => void;
    expanded: boolean;
    topBarElement?: JSX.Element;
    style?: React.CSSProperties
}

export const Topbar : React.FC<Props> = props => {
    const didMountRef = useRef(false);

    useEffect(() => {
        if(!didMountRef.current) {
            didMountRef.current = true;
        }
    }, []);

    return <>
        <nav style={props.style} className={`rb-topbar-wrapper ${props.expanded ? 'rb-topbar-expanded' : ''}`}>
            <button id={'toggleSidebar'} onClick={props.onSidebarToggle} ><img src={bars} /></button>
            {props.topBarElement}
        </nav>
    </>
};
