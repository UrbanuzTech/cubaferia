import React from 'react';
import './App.css';
import Footer from './generic/footer'
import Header from "./generic/header";
import NavMenu from "./generic/nav_menu";
import {pushRotate as Menu} from 'react-burger-menu'
import * as provider from './utils/provider';

class App extends React.Component {
    api: any;

    componentDidMount(): void {
        this.getData();
    }

    getData() {
        provider.getValueList('nomenclature').then((data) => {
            console.log(data);
            this.api = data;
        }, (err) => {
            console.log(err);
        });
    }


    showSettings(e: any) {
        e.preventDefault();
    }

    render() {
        return (


            <div className="App">

                <div id="outer-container">

                    <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"} disableAutoFocus>
                        <div className="Card">
                            <p className="Text">CubaFeria</p>
                            <a className="App-link"
                               href="https://github.com/UrbanuzTech/cubaferia"
                               target="_blank"
                               rel="noopener noreferrer">
                                <i className="fa fa-github"> </i><br/>
                                GitHub
                            </a>
                        </div>
                        <a id="home" className="bm-item" href="/">Continuar Facebook <i
                            className="fa fa-facebook-square"> </i></a>
                        <a id="about" className="bm-item" href="/">Continuar Google <i
                            className="fa fa-google"> </i></a>
                        <a id="contact" className="bm-item" href="/">Regístrate Gratis</a>
                    </Menu>

                    <main id="page-wrap">

                        <Header/>

                        <header className="App-header">
                            <div className="Card">
                                <div className="Text">
                                    <p>CubaFeria</p>
                                    <a className="App-link"
                                       href="https://github.com/UrbanuzTech/cubaferia"
                                       target="_blank"
                                       rel="noopener noreferrer">
                                        <i className="fa fa-github"> </i><br/>
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </header>

                        <NavMenu/>

                        <Footer/>

                    </main>

                </div>

            </div>
        );
    }
}

export default App;
