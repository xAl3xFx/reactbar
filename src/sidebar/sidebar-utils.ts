import {SidebarItem} from "./SidebarOld";
import {SidebarItemModel} from "./Sidebar";

export class SidebarUtils {
    static convertSidebarItemToSidebarItemModel = (item : SidebarItem, parentItem?: SidebarItemModel) : SidebarItemModel => {
        const currentParent : SidebarItemModel = {
            className: item.className,
            command: item.command,
            label: item.label,
            disabled: !!item.disabled,
            expanded: false,
            active: false,
            id: item.id,
            parent: parentItem,
            children: []
        }
        const children : SidebarItemModel[] = (item.children || []).map(item => SidebarUtils.convertSidebarItemToSidebarItemModel(item, currentParent));
        currentParent.children = children;
        return currentParent;
    }

    static validateUniqueItemIds = (item: SidebarItem, idsArr: string[] = []) => {
        if (item.id === undefined || idsArr.includes(item.id))
            throw new Error("When `itemPathsMap` prop is provided, all items should have unique ids");
        idsArr.push(item.id);
        if (item.children) {
            for (let childItem of item.children)
                SidebarUtils.validateUniqueItemIds(childItem, idsArr);
        }

        return idsArr;
    }

    static validateItems = (items: SidebarItem[], itemPathsMap: {[key: string] : string}) => {
        let itemsIds = [];
        for(let item of items){
            const currIds = SidebarUtils.validateUniqueItemIds(item);
            itemsIds.push(...currIds);
        }

        //Validate all item ids are in the itemPathsMap
        for(let itemId of itemsIds){
            if(!Object.values(itemPathsMap).includes(itemId)){
                throw new Error("Missing regex for item with id `" + itemId + "`")
            }
        }
    }

}
