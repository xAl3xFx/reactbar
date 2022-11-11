import * as React from 'react';
import './sidebar.css'
import {useRef, useState} from "react";
import {Topbar} from "./Topbar";

export interface SidebarItem {
    className: string;
    label: string;
    command: () => void;
    children?: SidebarItem[];
    disabled?: boolean;
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
        if(item.disabled)
            return;

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

        if(parentIndex === undefined){
            const span = liElement.querySelector('span');
            if(span){
                const i = span.querySelector('i');
                if(i){
                    if(i.className === props.collapseIcon){
                        i.className = props.expandIcon;
                    }else{
                        i.className = props.collapseIcon;
                    }
                }
            }
        }
    }

    const createMenu = (items: SidebarItem[], parentId: string | undefined) => {
        return <ul id={parentId ? 'children-' + parentId : undefined}
                   className={parentId ? 'rb-sidebar-child' : undefined}>
            {items.map((item, elementIndex) => {
                    const index = (parentId ? parentId + '-' + elementIndex : String(elementIndex));
                    const liElement = document.querySelector('#li-' + index);
                    const groupExpanded = liElement && liElement.classList.contains('rb-sidebar-item-expanded');
                console.log(groupExpanded)

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
                                                    <i className={groupExpanded ? props.collapseIcon : props.expandIcon}></i>
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

