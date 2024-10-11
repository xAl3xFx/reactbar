import * as React from 'react';
import {SidebarItem} from "../src";
import './index.css'
import {useEffect, useState} from "react";
import {Button} from "primereact/button";
import {Route, Routes, useLocation, useNavigate} from "react-router";
import {Home} from "./components/Home";
import {Orders} from "./components/Orders";
import {SidebarOld} from "../src";
import {Sidebar} from "../src/sidebar/Sidebar";
import {Search} from "./components/Search";

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [locationPath, setLocationPath] = useState<string>();
    const [itemExpanded, setItemExpanded] = useState<string>();

    const items: SidebarItem[] = [
        {
            id: 'search',
            className: 'fas fa-search',
            command: () => navigate('/search'),
            label: "Search"
        },
        {
            className: 'fas fa-house',
            command: () => navigate('/'),
            label: "Home",
            id: 'home',
            children: [
                {
                    id: 'home-1',
                    className: 'fa fa-list',
                    command: () => navigate('/home/1'),
                    label: "Info",
                },
                {
                    id: 'home-2',
                    className: 'fa fa-list',
                    command: () => navigate('/home/2'),
                    label: "Info2",
                },
                {
                    id: "home-3",
                    className: 'fa fa-list',
                    command: () => navigate('/home/3'),
                    label: "Info3",
                },
                {
                    id: 'home-4',
                    className: 'fa fa-list',
                    command: () => navigate('/home/4'),
                    label: "Info4",
                }
            ]
        },
        {
            className: 'fas fa-dollar',
            command: () => navigate('/orders'),
            label: "Orders",
            id: 'orders',
            children: [
                {
                    id: 'orders-1',
                    className: 'fa fa-list',
                    command: () => navigate('/orders/1'),
                    label: "Order 1",
                },
                {
                    id: 'orders-2',
                    className: 'fa fa-list',
                    command: () => navigate('/orders/2'),
                    label: "Order 2",
                },
                {
                    id: 'orders-3',
                    className: 'fa fa-list',
                    command: () => navigate('/orders/3'),
                    label: "Order 3",
                },
                {
                    id: 'orders-4',
                    className: 'fa fa-list',
                    command: () => navigate('/orders/4'),
                    label: "Order 4",
                    children: [
                        {
                            id: 'orders-4-1',
                            className: 'fa fa-list',
                            command: () => navigate('/orders/4/1'),
                            label: "Order 4-1",
                        }
                    ]
                }
            ]
        }
    ]

    useEffect(() => {
        setLocationPath(location.pathname)
    }, [location])

    const itemPathsMap = {
        '^\\/$' : 'home',
        '^\\/home\\/1$' : 'home-1',
        '^\\/home\\/2$' : 'home-2',
        '^\\/home\\/3$' : 'home-3',
        '^\\/home\\/4$' : 'home-4',
        '^\\/orders$' : 'orders',
        '^\\/orders\\/1$' : 'orders-1',
        '^\\/orders\\/2$' : 'orders-2',
        '^\\/orders\\/3$' : 'orders-3',
        '^\\/orders\\/4$' : 'orders-4',
        '^\\/orders\\/4\\/1$' : 'orders-4-1',
        '^\\/search$' : 'search',
    }

    return <>
        <Sidebar sidebarExpanded={true} items={items} topbarStyle={{background: ''}} className={'sidebar-black'}
                 expandIcon={'fas fa-chevron-down'} collapseIcon={'fas fa-chevron-up'}
                 itemPathsMap={itemPathsMap} locationPath={locationPath}>
            <h1>App component</h1>
            <Button label={"Orders"} onClick={() => navigate('/orders')}/>
            <Button label={"Orders - Orders 1"} onClick={() => navigate('/orders/1')}/>
            <Button label={"Search"} onClick={() => navigate('/search')}/>
            <Routes>
                <Route index element={<Home/>}/>
                <Route path="/orders" element={<Orders/>}/>
                <Route path="/search" element={<Search />}/>
            </Routes>
        </Sidebar>
    </>
};

export default App;
