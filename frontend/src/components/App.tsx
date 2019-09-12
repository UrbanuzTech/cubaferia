import React from 'react';
import './App.css';
import Footer from './generic/footer'
import Header from "./generic/header";
import NavMenu from "./generic/nav_menu";

const App: React.FC = () => {
    return (
        <div className="App">

            <Header/>

            <header className="App-header">
                <p>
                    CubaFeria
                </p>
                <a className="App-link"
                   href="https://github.com/UrbanuzTech/cubaferia"
                   target="_blank"
                   rel="noopener noreferrer">
                    GitHub
                </a>
            </header>

            <NavMenu/>

            <Footer/>

        </div>
    );
}

export default App;
