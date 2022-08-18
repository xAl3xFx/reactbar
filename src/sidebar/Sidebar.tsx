import * as React from 'react';
import './sidebar.css'
import {useRef, useState} from "react";
import {Topbar} from "./Topbar";
import chevronUp from './icons/chevron-up-solid.svg';
import chevronDown from './icons/chevron-down-solid.svg';

export interface SidebarItem {
    className: string;
    label: string;
    command: () => void;
    children?: SidebarItem[]
}

interface Props {
    children: any;
    items: SidebarItem[];
    topBarRightElement?: JSX.Element;
    onTopBarExpanded?: (expanded: boolean) => void;
    topbarStyle?: React.CSSProperties;

}

export const Sidebar: React.FC<Props> = (props) => {
    const prevLiClickedRef = useRef<any>();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);



    const handleItemClicked = (index: string, item: SidebarItem) => {
        item.command();

        const liElement = document.getElementById("li-" + index);
        if(!liElement)
            return;

        if (prevLiClickedRef.current && prevLiClickedRef.current.classList ) {
            prevLiClickedRef.current.classList.remove('rb-sidebar-active');
        }


        liElement.classList.add('rb-sidebar-active');
        prevLiClickedRef.current = liElement;

        const child = document.getElementById("children-" + index);
        if (child) {
            const hidden = child.classList.contains('rb-sidebar-hidden');
            child.classList.toggle('rb-sidebar-hidden');
            const parent = child.previousSibling;
            if (parent) {
                //@ts-ignore
                const childSpan = parent.querySelector("span");
                if (childSpan) {
                    const img = childSpan.querySelector("img");
                    if (img) {
                        if (hidden)
                            img.src = chevronUp
                        else
                            img.src = chevronDown;
                            // i.classList = "pi pi-chevron-down"
                    }
                }
            }
        }
    }

    const createMenu = (items: SidebarItem[], parentId: string | undefined) => {
        return <ul>
            {items.map((item, elementIndex) => {
                    const index = (parentId ? parentId + '-' + elementIndex : String(elementIndex))
                    return <React.Fragment key={index}>
                        <li id={'li-' + index} className={`${item.className} ${parentId ? 'rb-no-border' : ''}`}
                            onClick={() => handleItemClicked(index, item)}>
                            {
                                sidebarExpanded ?
                                    <span>
                                        <a>{item.label}</a>
                                        {item.children && item.children.length > 0 ?
                                            <img src={chevronDown}></img>
                                            : null
                                        }
                                    </span>
                                    : null
                            }

                        </li>
                        {item.children && item.children.length > 0 ?
                            <li id={'children-' + index}
                                className={'rb-sidebar-hidden rb-sidebar-child'}>
                                {createMenu(item.children, index)}
                            </li>
                            : null}
                    </React.Fragment>
                }
            )}
        </ul>
    }

    return <>
        <div className={`rb-sidebar-wrapper ${sidebarExpanded ? 'rb-sidebar-expanded' : 'rb-sidebar-collapsed'}`}>
            {createMenu(props.items, undefined)}
        </div>

        <div className={`rb-sidebar-mask ${sidebarExpanded ? 'rb-sidebar-mask-visible' : ''}`}></div>
        <Topbar onSidebarToggle={() => setSidebarExpanded(!sidebarExpanded)} expanded={sidebarExpanded} topBarRightElement={props.topBarRightElement} style={props.topbarStyle} />
        <main className={`${sidebarExpanded ? 'rb-sidebar-content-expanded' : 'rb-sidebar-content-collapsed'}`}>
            {props.children}
        </main>
    </>
};

