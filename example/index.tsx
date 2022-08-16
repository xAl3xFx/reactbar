import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Sidebar, SidebarItem} from '../src/sidebar';
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import './index.css'
import {Button} from "primereact/button";
import "primeicons/primeicons.css";
import {useState} from "react";
import {Divider} from "primereact/divider";
import {DataTable} from "primereact/datatable";
import {Test} from "../src/sidebar/test";

const App = () => {
  const [expanded, setExpanded] = useState(false);

  const items : SidebarItem[] = [
    {
      className: 'pi pi-home',
      command: () => console.log('home'),
      label: "Home",
      children: [
        {
          className: 'pi pi-info',
          command: () => console.log('info 1'),
          label: "Info",
        },
        {
          className: 'pi pi-info',
          command: () => console.log('info 2'),
          label: "Info2",
        }
      ]
    },
    {
      className: 'pi pi-search',
      command: () => 0,
      label: "Search"
    }
  ]

  return <>
    <Sidebar expanded={expanded} items={items} >
      <Button  icon={'pi pi-bars'} onClick={() => setExpanded(!expanded)} />
      <Divider>
        asd
      </Divider>
      <DataTable>

      </DataTable>
    </Sidebar>
  </>


};

ReactDOM.render(<App />, document.getElementById('root'));
