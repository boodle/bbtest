(function($) {
    $(document).ready(function() {                                                                  // inside a document ready so that the template elemenst will be available

        /**
         * A single column to display
         */
        window.BranchView = Backbone.View.extend({

            template: _.template($("#branchView").html()),

            /**
             * Set visibility for the View methods
             * @return void
             */
            initialize: function() {
                _.bindAll(this,
                    'render',
                    'render_allNodes',
                    'render_node');

                this.nodeViews = [];
                this.model.nodeCollection.on('reset',this.render_allNodes);
            },

            /**
             * Render a branch (one column)
             * @return View
             */
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));

                this.nodeViews = [];
                this.model.nodeCollection.each(this.render_node);

                $('li.node_'+this.model.get('parent_nodeId')).addClass('selected');             // add the selected colour to the node
                
                return this;
            },

            render_allNodes: function() {
                this.nodeViews = [];
                this.model.nodeCollection.each(this.render_node);
            },

            render_node: function(node) {
                if(typeof(this.nodeViews[node.id]=='undefined')) {
                    this.nodeViews[node.id] = new NodeView({
                        model: node,
                        attributes: {
                            class: 'node node_'+node.id+(node.get('hasDescendants')==1?' hasDescendants':''),
                            nodeId: node.id
                        }
                    });

                    this.$('ul').append(this.nodeViews[node.id].render().el);
                }
            }
        });
    });
})(jQuery);