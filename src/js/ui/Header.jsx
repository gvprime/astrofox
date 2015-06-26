'use strict';

var React = require('react');
var Browser = require('../Browser.js');

var Header = React.createClass({
    componentDidMount: function() {
        this.window = Browser.Window;
        this.maximized = false;
    },

    shouldComponentUpdate: function() {
        return false;
    },

    handleMinimize: function(e) {
        e.preventDefault();
        e.stopPropagation();

        this.window.minimize();
    },

    handleMaximize: function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.maximized) {
            this.window.unmaximize();
        }
        else {
            this.window.maximize();
        }

        this.maximized = !this.maximized;
    },

    handleClose: function(e) {
        e.preventDefault();
        e.stopPropagation();

        this.window.close(true);
    },

    handleConsole: function(e) {
        e.preventDefault();
        e.stopPropagation();

        this.window.showDevTools();
    },

    handleReload: function(e) {
        e.preventDefault();
        e.stopPropagation();

        this.window.reloadDev();
    },


    render: function() {
        return (
            <div id="header">
                <div className="icon"><img src="resources/images/icon.png" /></div>
                <div className="title">ASTROFOX</div>
                <div className="window-buttons">
                    <ul>
                        <li className="button icon-code" onClick={this.handleConsole}></li>
                        <li className="button icon-cw" onClick={this.handleReload}></li>
                        <li className="button icon-minus" onClick={this.handleMinimize}></li>
                        <li className="button icon-plus" onClick={this.handleMaximize}></li>
                        <li className="button icon-cross" onClick={this.handleClose}></li>
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = Header;