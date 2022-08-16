import * as React from 'react';
import './index.css'
import {useRef} from "react";

export interface SidebarItem {
    className: string;
    label: string;
    command: () => void;
    children?: SidebarItem[]
}

interface Props {
    expanded: boolean;
    children: any;
    items: SidebarItem[]
}

export const Sidebar: React.FC<Props> = (props) => {
    const prevLiClickedRef = useRef<any>();

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
                                props.expanded ?
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
        <div className={`rb-sidebar-wrapper ${props.expanded ? 'rb-sidebar-expanded' : 'rb-sidebar-collapsed'}`}>
            {createMenu(props.items, undefined)}
        </div>

        <main className={props.expanded ? 'rb-sidebar-content-expanded' : ''}>
            {props.children}
        </main>
    </>
};

