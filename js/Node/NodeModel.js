(function($) {

    /**
     * Data container for a node
     * @return void
     */
    window.NodeModel = Backbone.Model.extend({

        url: '',

        defaults: {
            title: '',
            text: '',
            display_order: 0,
            hasDescendants: false
        }
    });

})(jQuery);