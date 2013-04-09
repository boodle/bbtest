/**
 * Admin app for the IBE / Serco Ethics app
 *
 * Dependencies:
 *      underscore     1.4.2+
 *      backbone       0.9.2+
 *      jQuery         1.8.2+
 *
 * 
 * @author Total Onion Ltd
 * @copyright Institute of Business Ethics 2013
 */
var app = {

    online: false,                                                                                      // do we currently have an online connection

    initialize: function() {
        trace('starting '+config.pageTitleRoot+' v'+config.version);

        switch(config.mode) {
            case 'app':
                document.addEventListener('deviceready', this.onDeviceReady, false);
                document.addEventListener('load', this.onLoad, false);
                document.addEventListener('offline', this.onOffline, false);
                document.addEventListener('online', this.onOnline, false);
                break;

            case 'web':
                $(document).ready(function() {
                    app.onDeviceReady();
                });
        }
    },

    onDeviceReady: function() {
        trace('app.onDeviceReady()');
        var BackboneApp = Backbone.Router.extend({
            path: [],
            routes: {
                '':                     'home',
                'b/*pathString':        'home'
            },

            initialize: function() {
                window.treeModel = new TreeModel();
                window.treeView = new TreeView({
                    model: window.treeModel,
                });
                $('.app').append(window.treeView.render().el);
            },

            home: function(pathString) {
                this.show_loader();
                if(typeof(pathString)!='undefined'){
                    this.path = pathString.split('/');
                } else {
                    this.path = [];
                }

                window.treeView.do_initialSetup(this.path);
            },

            navigateDown: function(parent_nodeId) {
                this.path.push(parent_nodeId);
                window.backboneApp.navigate('/b/'+ this.path.join('/'));
            },

            navigateReplace: function(parent_nodeId){
                this.path.pop();
                this.path.push(parent_nodeId);
                window.backboneApp.navigate('/b/'+ this.path.join('/'),{replace:true});
            },

            navigateHome: function() {
                this.path = [];
                window.backboneApp.navigate('/');
            },

            show_loader: function() {
                $('#loader').show();
            },

            hide_loader: function() {
                if(window.treeView.doneInitialSetup) {
                    $('#loader').hide();
                }
            }
        });

        window.backboneApp = new BackboneApp();
        Backbone.history.start();
    },

    onLoad: function() {
    },

    onOnline: function() {
        this.online = true;
    },

    onOffline: function() {
        this.online = false;
    }
};

/**
 * Fuck-up prevention; checks to see if the console exists before posting to it,
 * so that console.log messages that are accidentally left in do not break a
 * page when run live. Called "trace" as I have been doing a lot of AS3 today
 * and I keep typing it anyway
 * @param message
 * @return void
 */
function trace(message,highlight) {
    if(typeof(console) != 'undefined' && typeof(console.log) == 'function') {
        if(window.app.mode=='app') {
            console.log('##' + message);
        } else {
            console.log(message);
        }
    }
}