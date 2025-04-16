import React from "react";
import Search_Bar from "./Search_Bar";
import { useState } from "react";

export default function NavBar() {

    return (
        <>
            <nav className="nav-bar">
                <div className="logo">
                    <span role="img">🍿</span>
                    <h1>usePopcorn</h1>
                </div>
                <Search_Bar />
                <p className="num-results">
                    Found <strong>X</strong> results
                </p>
            </nav>

        </>)


}