(function($) {

    /**
     * Data container for the Tree
     * @return void
     */
    window.TreeModel = Backbone.Model.extend({

        url: '',

        initialize: function() {
            _.bindAll(this,
                'add_branchToTree',
                'replace_branchOnTree');
            this.branchCollection = new BranchCollection();
        },

        add_branchToTree: function(parent_nodeId) {
            this.branchCollection.add(new BranchModel({
                parent_nodeId:parent_nodeId,
                treeIndex:this.branchCollection.length
            }));
        },

        /**
         * Same as the above method, but the last branch
         * is replaced rather than added to.
         * @param int parent_nodeId
         */
        replace_branchOnTree: function(parent_nodeId) {
            this.branchCollection.pop();
            this.add_branchToTree(parent_nodeId);
        }
    });

})(jQuery);