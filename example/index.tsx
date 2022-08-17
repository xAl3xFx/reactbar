import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Sidebar, SidebarItem} from '../src/sidebar/Sidebar';
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import './index.css'
import "primeicons/primeicons.css";
import {Divider} from "primereact/divider";
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import reportWebVitals from "./reportWebVitals";
import {useEffect, useState} from "react";
import {InputText} from "primereact/inputtext";

const App = () => {
  const [component, setComponent] = useState<any>(null);
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

  useEffect(() => {
    setTimeout(() => {
      setComponent(<Button>Hello</Button>);
    }, 4000)
  }, []);


  const topbarRightElement = <>
    <Button icon={'pi pi-search'} label={'heelo'}/>
  </>

  return <>
    <Sidebar items={items} topBarRightElement={topbarRightElement} >
      <label>Hello</label>
      {component}
      <Divider>
        asd
      </Divider>
      <DataTable>

      </DataTable>
    </Sidebar>
  </>


};

ReactDOM.render(<App />, document.getElementById('root'));
reportWebVitals(console.log);