import * as React from 'react';
import './sidebar.css'
import {useEffect, useRef, useState} from "react";
import {Topbar} from "./Topbar";

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
    topbarStyle?: React.CSSProperties

}

export const Sidebar: React.FC<Props> = (props) => {
    const prevLiClickedRef = useRef<any>();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    useEffect(() => {
        if(props.onTopBarExpanded)
            props.onTopBarExpanded(sidebarExpanded);
        const isDesktop = window.innerWidth > 1024;
        const maskElement = document.getElementById('rb-sidebar-overlay-mask');
        if(maskElement){
            if(!isDesktop && sidebarExpanded){
                maskElement.classList.add('rb-sidebar-overlay-mask');
            }else{
                maskElement.classList.remove('rb-sidebar-overlay-mask');
            }
        }
    }, [sidebarExpanded]);


    const handleItemClicked = (index: string, e: React.MouseEvent<HTMLLIElement, MouseEvent>, item: SidebarItem) => {
        item.command();

        if (prevLiClickedRef.current && prevLiClickedRef.current.classList) {
            prevLiClickedRef.current.classList.remove('rb-sidebar-active');
        }

        //@ts-ignore
        e.target.classList.add('rb-sidebar-active');
        prevLiClickedRef.current = e.target;

        const child = document.getElementById("children-" + index);
        if (child) {
            const hidden = child.classList.contains('rb-sidebar-hidden');
            child.classList.toggle('rb-sidebar-hidden');
            const parent = child.previousSibling;
            if (parent) {
                //@ts-ignore
                const childSpan = parent.querySelector("span");
                if (childSpan) {
                    const i = childSpan.querySelector("i");
                    if (i) {
                        if (hidden)
                            i.classList = "pi pi-chevron-up"
                        else
                            i.classList = "pi pi-chevron-down"
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
                        <li className={`${item.className} ${parentId ? 'rb-no-border' : ''}`}
                            onClick={(e) => handleItemClicked(index, e, item)}>
                            {
                                sidebarExpanded ?
                                    <span>
                                        <a>{item.label}</a>
                                        {item.children && item.children.length > 0 ?
                                            <i className={'pi pi-chevron-down'}></i>
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
        <Topbar style={props.topbarStyle} onSidebarToggle={() => setSidebarExpanded(!sidebarExpanded)} expanded={sidebarExpanded} topBarRightElement={props.topBarRightElement} />
        <main className={`${sidebarExpanded ? 'rb-sidebar-content-expanded' : 'rb-sidebar-content-collapsed'}`}>
            {props.children}
        </main>
    </>
};

