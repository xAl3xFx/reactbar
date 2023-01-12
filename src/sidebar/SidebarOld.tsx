import * as React from 'react';
import './sidebar.css'
import {useEffect, useRef, useState} from "react";
import {Topbar} from "./Topbar";


export interface SidebarItem {
    className: string;
    label: string;
    command: () => void;
    children?: SidebarItem[];
    disabled?: boolean;
    id: string;
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
    sidebarExpanded?: boolean;
    itemPathsMap?: { [key: string]: string };
    locationPath?: string;
}



export const SidebarOld: React.FC<Props> = (props) => {
    const prevLiClickedRef = useRef<any>();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    useEffect(() => {
        if (props.sidebarExpanded)
            setSidebarExpanded(true);
    }, [props.sidebarExpanded]);

    const validateUniqueItemIds = (item: SidebarItem, idsArr: string[] = []) => {
        if (item.id === undefined || idsArr.includes(item.id))
            throw new Error("When `itemPathsMap` prop is provided, all items should have unique ids");
        idsArr.push(item.id);
        if (item.children) {
            for (let childItem of item.children)
                validateUniqueItemIds(childItem, idsArr);
        }
    }

    useEffect(() => {
        if (props.items && props.itemPathsMap) {
            for (let item of props.items){
                validateUniqueItemIds(item);
            }
        }
    }, [props.itemPathsMap, props.items]);

    const tryMatchItem = (pathname: string, item: SidebarItem, parentItem: SidebarItem | undefined): { index: string, parentIndex: string | undefined } | undefined => {
        if (!props.itemPathsMap || props.locationPath === undefined) return undefined;

        for (const [key, value] of Object.entries(props.itemPathsMap)) {
            const regex = new RegExp(key);
            const match = regex.test(pathname);
            if (match) {
                return {index: value, parentIndex: parentItem?.id}
            }
        }

        for(let child of item.children || []){
            const result = tryMatchItem(pathname, child, item);
            if(result)
                return result;
        }
        return undefined;
    }

    useEffect(() => {
        if (props.locationPath) {
            let result = undefined;
            for(let item of props.items){
                let curr = tryMatchItem(props.locationPath, item, undefined);
                if(curr){
                    result = curr;
                    break;
                }
            }
            if(result){
                const {index, parentIndex} = result;
                selectItemHelper(index, parentIndex);
            }
            console.log(result);
        }
    }, [props.locationPath]);


    const handleItemClicked = (event: any, index: string, item: SidebarItem, parentIndex: string | undefined) => {
        if (event && event.stopPropagation)
            event.stopPropagation();
        if (item.disabled)
            return;

        item.command();
        if (item.children === undefined && window.innerWidth < 1024) {
            setSidebarExpanded(false)
        }
        selectItemHelper(index, parentIndex);
    }

    const selectItemHelper = (index: string, parentIndex: string | undefined) => {
        const liElement = document.getElementById("li-" + index);
        if (!liElement)
            return;


        //If there is previously opened menu item - close it
        const previousMenuItem = document.querySelector('.rb-sidebar-item-expanded');
        if (previousMenuItem && parentIndex === undefined && previousMenuItem !== liElement) {
            previousMenuItem.classList.toggle('rb-sidebar-item-expanded');
        }

        if (prevLiClickedRef.current && prevLiClickedRef.current.classList) {
            prevLiClickedRef.current.classList.remove('rb-sidebar-active');
            if (prevLiClickedRef.current.id && prevLiClickedRef.current.id.indexOf('-') !== prevLiClickedRef.current.id.lastIndexOf('-')) {
                prevLiClickedRef.current.classList.toggle('rb-sidebar-item-expanded');
            }
        }

        if (prevLiClickedRef.current === liElement && parentIndex === undefined)
            liElement.classList.toggle('rb-sidebar-item-expanded')
        else
            liElement.classList.add('rb-sidebar-item-expanded')

        liElement.classList.add('rb-sidebar-active');

        prevLiClickedRef.current = liElement;

        if (parentIndex === undefined) {
            const span = liElement.querySelector('span');
            if (span) {
                const i = span.querySelector('i');
                if (i) {
                    if (i.className === props.collapseIcon) {
                        i.className = props.expandIcon;
                    } else {
                        i.className = props.collapseIcon;
                    }
                }
            }
        }
    }

    const createMenu = (items: SidebarItem[], parentId: string | undefined) => {
        console.log('createMenu')
        return <ul id={parentId ? 'children-' + parentId : undefined}
                   className={parentId ? 'rb-sidebar-child' : undefined}>
            {items.map((item, elementIndex) => {
                    let index = "";
                    if(props.itemPathsMap){
                        index = item.id!;
                    }else{
                        index = (parentId ? parentId + '-' + elementIndex : String(elementIndex));
                    }
                    const liElement = document.querySelector('#li-' + index);
                    const groupExpanded = liElement && liElement.classList.contains('rb-sidebar-item-expanded');

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
