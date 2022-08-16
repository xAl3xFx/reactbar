import * as React from 'react';
import './test.css'
import {useEffect} from "react";

export const Test = () => {

    const initMenu = () => {
        //@ts-ignore
        document.querySelectorAll("#menu ul").forEach(el => el.style.display = 'none')
        // $('#menu ul').hide();
        // $('#menu ul').children('.current').parent().show();
        // //$('#menu ul:first').show();
        // $('#menu li a').click(
        //     function() {
        //         var checkElement = $(this).next();
        //         if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
        //             return false;
        //         }
        //         if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
        //             $('#menu ul:visible').slideUp('normal');
        //             checkElement.slideDown('normal');
        //             return false;
        //         }
        //     }
        // );
    }

    useEffect(() => {
        initMenu();
    }, []);


    return <div id="sidebar-wrapper">
        <ul className="sidebar-nav nav-pills nav-stacked" id="menu">
            <li className="active">
                <a href="#"><span className="pi pi-bars"></span> Dashboard</a>
                <ul className="nav-pills nav-stacked " style={{listStyleType: "none"}}>
                    <li><a href="#"><span className="pi pi-chevron-right"></span> link 1</a></li>
                    <li><a href="#"><span className="pi pi-chevron-right"></span> link 2</a></li>
                </ul>
            </li>
            <li>
                <a href="#"><span className="pi pi-forward"></span> Shortcut</a>
                <ul style={{listStyleType: "none"}}>
                    <li><a href="#"><span className="pi pi-chevron-right"></span> link 1</a></li>
                    <li><a href="#"><span className="pi pi-chevron-right"></span> link 2</a></li>
                </ul>
            </li>
            <li>
                <a href="#"><span className={'pi pi-search'}></span> Overview</a>
            </li>
        </ul>
    </div>
}

