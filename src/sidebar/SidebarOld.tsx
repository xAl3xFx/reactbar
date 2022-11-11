import * as React from 'react';
import './sidebar-old.css'
import {useRef, useState} from "react";
import {Topbar} from "./Topbar";

export interface SidebarItem {
    className: string;
    label: string;
    command: () => void;
    children?: SidebarItem[];
}

interface Props {
    children: any;
    items: SidebarItem[];
    expandIcon: string;
    collapseIcon: string;
    topBarElement?: JSX.Element;
    onSidebarToggled?: (expanded: boolean) => void;
    topbarStyle?: React.CSSProperties;
    className?: string;

}

export const SidebarOld: React.FC<Props> = (props) => {
    const prevLiClickedRef = useRef<any>();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const handleItemClicked = (index: string, item: SidebarItem) => {
        item.command();
        if(item.children === undefined && window.innerWidth < 1024){
            setSidebarExpanded(false)
        }

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
                    const img = childSpan.querySelector("i");
                    if (img) {
                        if (hidden)
                            img.className = props.collapseIcon;
                        else
                            img.className = props.expandIcon;
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
                                            <i className={props.expandIcon}></i>
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
        <div className={`rb-sidebar-wrapper ${sidebarExpanded ? 'rb-sidebar-expanded' : 'rb-sidebar-collapsed'} ${props.className || ''}`}>
            {createMenu(props.items, undefined)}
        </div>

        <div className={`rb-sidebar-mask ${sidebarExpanded ? 'rb-sidebar-mask-visible' : ''}`}></div>
        <Topbar onSidebarToggle={() => setSidebarExpanded(!sidebarExpanded)} expanded={sidebarExpanded} topBarElement={props.topBarElement} style={props.topbarStyle} />
        <main className={`${sidebarExpanded ? 'rb-sidebar-content-expanded' : 'rb-sidebar-content-collapsed'}`}>
            {props.children}
        </main>
    </>
};

