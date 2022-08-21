import * as React  from 'react';
import {Sidebar, SidebarItem} from "../src";
import './index.css'

const App = () => {
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
                }
            ]
        },
        {
            className: 'fas fa-search',
            command: () => 0,
            label: "Search"
        }
    ]


    // const topbarRightElement = <>
    //     <button className={'fa-solid fa-arrow-right-from-bracket'}>Logout</button>
    // </>

    return <>
        <Sidebar items={items} topbarStyle={{background: ''}}  >
            <h1>App component</h1>
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