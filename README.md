# reactbar

> Navigation bars for React applications.

## Dependencies
> react >= 16

## Table of contents

- [Project Name](#project-name)
    - [Dependencies](#dependencies)
    - [Table of contents](#table-of-contents)
    - [Getting Started](#getting-started)
    - [Usage](#usage)
    - [Contributing](#contributing)
    - [Built With](#built-with)
    - [Versioning](#versioning)
    - [Authors](#authors)
    - [License](#license)

## Installation

### npm
```sh
$ npm install @xal3xfx/reactbar
```

### yarn

```sh
$ yarn add @xal3xfx/reactbar
```

# Usage

## Sidebar

The **Sidebar** is a wrapper for your application. Put all of your components inside the **Sidebar**.

> Recommended to have `height: 100%` on **html** and **#root** and no `margin` on **body**.
```css
body{
    margin: 0;
}

html, #root{
    height: 100%;
}
```

## Desktop
| Expanded                                                                         | Collapsed        |
|----------------------------------------------------------------------------------|------------------|
| ![img_1.png](https://github.com/xAl3xFx/reactbar/blob/master/img_1.png?raw=true) | ![img.png](https://github.com/xAl3xFx/reactbar/blob/master/img.png?raw=true)     |

## Mobile
| Expanded                                                                         | Collapsed                                                                        |
|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| ![img_3.png](https://github.com/xAl3xFx/reactbar/blob/master/img_3.png?raw=true) | ![img_2.png](https://github.com/xAl3xFx/reactbar/blob/master/img_2.png?raw=true) |


### Example

```typescript jsx
import * as React  from 'react';
import {Sidebar, SidebarItem} from "@xal3xfx/reactbar";
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

    return <>
        <Sidebar items={items} >
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
```

> Sidebar has required `items` property which is of type `SidebarItem[]` and represents the items in the sidebar menu.

#### SidebarItem
```typescript
interface SidebarItem {
    className: string;
    label: string;
    command: () => void;
    children?: SidebarItem[]
}
```

| Name       | Description                                                                                       | Default Value |
|------------|---------------------------------------------------------------------------------------------------|---------------|
| className  | className for the item in the list. You can use it to put icon to the list item.                  | required      |
| label      | text to display for the item in the list.                                                         | required      |
| command    | function callback which is executed when the item in the list is clicked.                         | required      |
| children   | If you want to have expandable item in the list you should pass children which is `SidebarItem[]` | undefined     | 


### Props
| Name                  | Description                                                                                                                                                                                   | Default Value |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| items                 | `SidebarItem[]`                                                                                                                                                                               | required      |
| topBarElement         | Any `JSX.Element` which you want to be displayed on the `Topbar`.                                                                                                                             | undefined     |
| onSidebarToggled      | Function callback which is executed when the sidebar is clicked. The function accepts on parameter `expanded: boolean` which is true if the sidebar is expanded and false if it is collapsed. | undefined     |
| topbarStyle           | Style for the `Topbar`                                                                                                                                                                        | undefined     |

## Contributing

You are welcome to contribute with any new features or buf fixes.

## Built With

* [tsdx](https://tsdx.io/)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Alex Petrove** - *Initial work* - [Alex Petrov - xAl3xFx](https://github.com/xAl3xFx)

See also the list of [contributors](https://github.com/xAl3xFx/reactbar/contributors) who participated in this project.

## License

[MIT License](https://andreasonny.mit-license.org/2019) © Alex Petrov
