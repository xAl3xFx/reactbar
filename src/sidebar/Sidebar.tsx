import * as React from 'react';
import './sidebar.css'
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

export const Sidebar: React.FC<Props> = (props) => {
    const prevLiClickedRef = useRef<any>();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const handleItemClicked = (event : any, index: string, item: SidebarItem, parentIndex: string | undefined) => {
        event.stopPropagation();
        item.command();
        if (item.children === undefined && window.innerWidth < 1024) {
            setSidebarExpanded(false)
        }

        const liElement = document.getElementById("li-" + index);
        if (!liElement)
            return;


        //If there is previously opened menu item - close it
        const previousMenuItem = document.querySelector('.rb-sidebar-item-expanded');
        if(previousMenuItem && parentIndex === undefined && previousMenuItem !== liElement){
            previousMenuItem.classList.toggle('rb-sidebar-item-expanded');
        }

        if (prevLiClickedRef.current && prevLiClickedRef.current.classList) {
            prevLiClickedRef.current.classList.remove('rb-sidebar-active');
            if(prevLiClickedRef.current.id && prevLiClickedRef.current.id.indexOf('-') !== prevLiClickedRef.current.id.lastIndexOf('-')){
                prevLiClickedRef.current.classList.toggle('rb-sidebar-item-expanded');
            }
        }

        if(prevLiClickedRef.current === liElement && parentIndex === undefined)
            liElement.classList.toggle('rb-sidebar-item-expanded')
        else
            liElement.classList.add('rb-sidebar-item-expanded')

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
        return <ul id={parentId ? 'children-' + parentId : undefined}
                   className={parentId ? 'rb-sidebar-child' : undefined}>
            {items.map((item, elementIndex) => {
                    const index = (parentId ? parentId + '-' + elementIndex : String(elementIndex))
                    return <React.Fragment key={index}>
                        <li id={'li-' + index} className={`${parentId ? 'rb-no-border' : ''}`}
                            onClick={(e) => handleItemClicked(e, index, item, parentId)}>
                            <div style={{width: "100%"}}>
                                {
                                    sidebarExpanded ?
                                        <span className={item.className}>
                                                <a>{item.label}</a>
                                            {
                                                item.children && item.children.length > 0 ?
                                                    <i className={props.expandIcon}></i>
                                                    : null
                                            }

                                            </span>
                                        :
                                        <span className={item.className}>
                                        </span>
                                }
                                {item.children && item.children.length > 0 ?
                                    // <ul id={'children-' + index}
                                    //     className={'rb-sidebar-hidden rb-sidebar-child'}>
                                    createMenu(item.children, index)
                                    // </ul>
                                    : null
                                }
                            </div>

                        </li>

                    </React.Fragment>
                }
            )}
        </ul>
    }

    return <>
        <div
            className={`rb-sidebar-wrapper ${sidebarExpanded ? 'rb-sidebar-expanded' : 'rb-sidebar-collapsed'} ${props.className || ''}`}>
            {createMenu(props.items, undefined)}
        </div>

        <div className={`rb-sidebar-mask ${sidebarExpanded ? 'rb-sidebar-mask-visible' : ''}`}></div>
        <Topbar onSidebarToggle={() => setSidebarExpanded(!sidebarExpanded)} expanded={sidebarExpanded}
                topBarElement={props.topBarElement} style={props.topbarStyle}/>
        <main className={`${sidebarExpanded ? 'rb-sidebar-content-expanded' : 'rb-sidebar-content-collapsed'}`}>
            {props.children}
        </main>
    </>
};

