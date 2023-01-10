import * as React  from 'react';
import {SidebarItem} from "../src";
import './index.css'
import {Sidebar} from "../src/sidebar/Sidebar";
import {useState} from "react";
import {Button} from "primereact/button";

const App = () => {
    const [itemExpanded, setItemExpanded] = useState<string>();

    const items : SidebarItem[] = [
        {
            className: 'fas fa-house',
            command: () => console.log('home'),
            label: "Home",
            children: [
                {
                    className: 'fa fa-list',
                    command: () => console.log('info 1'),
                    label: "Info",
                },
                {
                    className: 'fa fa-list',
                    command: () => console.log('info 2'),
                    label: "Info2",
                },
                {
                    className: 'fa fa-list',
                    command: () => console.log('info 2'),
                    label: "Info3",
                },
                {
                    className: 'fa fa-list',
                    command: () => console.log('info 2'),
                    label: "Info4",
                }
            ]
        },
        {
            className: 'fas fa-dollar',
            command: () => console.log('orders'),
            label: "Orders",
            children: [
                {
                    className: 'fa fa-list',
                    command: () => console.log('info 1'),
                    label: "Order 1",
                },
                {
                    className: 'fa fa-list',
                    command: () => console.log('info 2'),
                    label: "Order 2",
                },
                {
                    className: 'fa fa-list',
                    command: () => console.log('info 2'),
                    label: "Order 3",
                },
                {
                    className: 'fa fa-list',
                    command: () => console.log('info 2'),
                    label: "Order 4",
                }
            ]
        },
        {
            className: 'fas fa-search',
            command: () => 0,
            label: "Search"
        }
    ]

    return <>
        <Sidebar sidebarExpanded={true} items={items} topbarStyle={{background: ''}} className={'sidebar-black'} expandIcon={'fal fa-chevron-down'} collapseIcon={'fal fa-chevron-up'} itemExpanded={itemExpanded} >
            <h1>App component</h1>
            <Button label={"Orders"} onClick={() => setItemExpanded('Orders')} />
            <Button label={"Search"} onClick={() => setItemExpanded('Search')} />
            <ChildComponent />
        </Sidebar>
    </>
};

const ChildComponent = () => {
    return <>
        I am child
    </>
}

export default App;
