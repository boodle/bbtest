(function($) {
    $(document).ready(function() {                                                                  // inside a document ready so that the template elemenst will be available

        /**
         * A single column to display
         */
        window.NodeView = Backbone.View.extend({

            template: _.template($("#nodeView").html()),
            tagName: 'li',

            /**
             * Set visibility for the View methods
             * @return void
             */
            initialize: function() {
                _.bindAll(this,
                    'render',
                    'on_click');
            },

            /**
             * Render a branch (one column)
             * @return View
             */
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));

                if(this.model.get('hasDescendants')) {
                    this.$el.on('click', this.on_click);
                }

                return this;
            },

            /**
             * When a user clicks on a node that has descendants
             * it should load the next branch
             */
            on_click: function() {
                if(this.model.get('hasDescendants')=="1") {
                    var branchElement = this.$el.parents('.branch');                                // grab the branch we are in
                    $('.node',branchElement).removeClass('selected');                               // remove other selected items in this branch
                    this.$el.addClass('selected');                                                  // add this as the selected item

                    if($(branchElement).hasClass('hide')) {
                        trace('it\'s not the end branch');
                        window.backboneApp.show_loader();
                        window.backboneApp.navigateReplace(this.model.id);
                        window.treeModel.replace_branchOnTree(this.model.id,true);
                    } else {
                        window.backboneApp.show_loader();
                        window.backboneApp.navigateDown(this.model.id);
                        window.treeModel.add_branchToTree(this.model.id,true);
                    }
                }
            }
        });
    });
})(jQuery);