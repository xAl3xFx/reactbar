import * as React from 'react';
import {useEffect, useState} from 'react';
import {SidebarItem} from "./SidebarOld";
import {Topbar} from "./Topbar";
import './sidebar.css'
import cloneDeep from 'lodash.clonedeep';
import isEqualWith from 'lodash.isequalwith';
import isFunction from 'lodash.isfunction';
import {SidebarUtils} from "./sidebar-utils";

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

export interface SidebarModel {
    items: SidebarItemModel[];
    expanded: boolean
}

export interface SidebarItemModel {
    className: string;
    label: string;
    command: () => void;
    children: SidebarItemModel[];
    disabled: boolean;
    expanded: boolean;
    active: boolean;
    id: string;
    parent?: SidebarItemModel
}

export const Sidebar : React.FC<Props> = props => {

    const [sidebarModel, setSidebarModel] = useState<SidebarModel>({expanded: false, items: []});
    const [location, setLocation] = useState<string>();
    const [lastMouseClickedId, setLastMouseClickedId] = useState<string>();
    const [itemsFromProps, setItemsFromProps] = useState<SidebarItem[]>();

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
        if(props.locationPath && props.locationPath !== location)
            setLocation(props.locationPath)
    }, [props.locationPath]);

    useEffect(() => {
        if(location){
            let result = undefined;
            for(let item of sidebarModel.items){
                let curr = tryMatchItem(location, item, undefined);
                if(curr){
                    result = curr;
                    break;
                }
            }
            if(result){
                const {index} = result;
                handleItemClicked(undefined, index, false);
            }
        }
    }, [location]);

    useEffect(() => {
        const isEqual = isEqualWith(props.items, itemsFromProps, (v1, v2) =>
            // if `customizer` returns `undefined`, comparisons are handled by the method instead
            isFunction(v1) && isFunction(v2) ? `${v1}` === `${v2}` : undefined,
        )
        if(isEqual || !props.items) return;

        if(props.itemPathsMap !== undefined){
            SidebarUtils.validateItems(props.items, props.itemPathsMap);
        }


        setItemsFromProps(props.items);
        const sidebarModelItems : SidebarItemModel[] = props.items.map(el => SidebarUtils.convertSidebarItemToSidebarItemModel(el, undefined));
        setSidebarModel(prevState => {return {...prevState, items: sidebarModelItems}});

    }, [props.items]);

    const findSidebarItemModelById = (items: SidebarItemModel[], itemId: string) : SidebarItemModel | undefined=> {
        for(let item of items){
            if(item.id === itemId)
                return item;
        }

        for(let item of items) {
            let current = findSidebarItemModelById(item.children, itemId);
            if(current !== undefined)
                return current;
        }
        return undefined;
    }

    const expandRecursively = (item: SidebarItemModel, expand: boolean) => {
        item.expanded = expand;
        if(item.parent)
            expandRecursively(item.parent, expand);
    }

    const collapseAndDeactivateAll = (items: SidebarItemModel[]) => {
        for(let item of items){
            item.expanded = false;
            item.active = false;

            // console.log('collapsed', item.id)
            collapseAndDeactivateAll(item.children);
        }
    }

    const handleItemClicked = (event: any, itemId: string, isMouseClick: boolean) => {
        if(event && event.stopPropagation)
            event.stopPropagation();

        if(!isMouseClick && lastMouseClickedId === itemId) {
            // console.log(`Location change called handleItemClicked but it is for item that was just clicked manually - ${itemId} \n\n\n\n`)
            return;
        }

        // console.log('handleItemClicked for ' + itemId + " " + (isMouseClick ? 'manually' : 'from location') + '\n\n\n');

        const items = cloneDeep(sidebarModel.items);
        const item = findSidebarItemModelById(items, itemId);

        //Select current item
        if(item !== undefined){

            if(isMouseClick){
                setLastMouseClickedId(itemId);
                item.command();
            }

            const expanded = item.expanded;
            //Collapse and unselect all items
            collapseAndDeactivateAll(items);
            if(item.parent)
                expandRecursively(item.parent, true);
            item.expanded = !expanded;
            item.active = true;

            // console.log(`item ${item.id} expanded`, !expanded)

            setSidebarModel(prevState => {return {...prevState, items: items}});
        }

    }

    const createMenu = (items: SidebarItemModel[], parent?: SidebarItemModel) => {
        // console.log('##### STARTED CREATING MENU #####');
        return <ul className={parent !== undefined ? 'rb-sidebar-child' : undefined}>
            {items.map((item) => {
                // console.log(`Generating item for ${item.id} which is ${item.expanded ? '' : 'not'} expanded and ${item.active ? '' : 'not'} active`)
                return <React.Fragment key={item.id}>
                    <li id={'li-' + item.id}
                        className={`${item.parent !== undefined ? 'rb-no-border' : ''} ${item.expanded ? 'rb-sidebar-item-expanded' : ''} ${item.active ? 'rb-sidebar-active' : ''}`}
                        onClick={(e) => handleItemClicked(e, item.id, true)}>
                        <div style={{width: "100%"}}>
                            {
                                sidebarModel.expanded ?
                                    <span className={item.className}>
                                                <a>{item.label}</a>
                                        {
                                            item.children && item.children.length > 0 ?
                                                <i className={item.expanded ? props.collapseIcon : props.expandIcon}></i>
                                                : null
                                        }

                                            </span>
                                    :
                                    <span className={item.className}>
                                        </span>
                            }
                            {item.children && item.children.length > 0 ?
                                createMenu(item.children, item)
                                : null
                            }
                        </div>

                    </li>
                </React.Fragment>
            })}
        </ul>
    }

    const toggleSidebar = () => {
        setSidebarModel(prevState => {return {...prevState, expanded: !prevState.expanded}});
    }

    return <>
        <div
            className={`rb-sidebar-wrapper ${sidebarModel.expanded ? 'rb-sidebar-expanded' : 'rb-sidebar-collapsed'} ${props.className || ''}`}>
            {createMenu(sidebarModel.items)}
        </div>
        <div className={`rb-sidebar-mask ${sidebarModel.expanded ? 'rb-sidebar-mask-visible' : ''}`}></div>
        <Topbar onSidebarToggle={toggleSidebar} expanded={sidebarModel.expanded}
                topBarElement={props.topBarElement} style={props.topbarStyle}/>
        <main className={`${sidebarModel.expanded ? 'rb-sidebar-content-expanded' : 'rb-sidebar-content-collapsed'}`}>
            {props.children}
        </main>
    </>
};
