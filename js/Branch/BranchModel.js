(function($) {

    /**
     * Data container for a Branch
     * @return void
     */
    window.BranchModel = Backbone.Model.extend({

        url: '',

        defaults: {
            parent_nodeId: 0,
            title: '',
            outcome: 'none'
        },

        initialize: function() {
            this.nodeCollection = new NodeCollection();

            var branchSetId = parseInt(this.get('parent_nodeId').toString().slice(-2));
            var url = 'resources/'+config.customization.companyId+'/'+config.dataFormatVersion+'/'+branchSetId+'.json';
            var model = this;
            
            $.ajax(url,{
                dataType: 'json',
                success: function(data) {
                    model.set({
                        id: data[model.get('parent_nodeId')].id,
                        outcome: data[model.get('parent_nodeId')].outcome,
                        parent_nodeId: data[model.get('parent_nodeId')].parent_nodeId,
                        title: data[model.get('parent_nodeId')].title
                    });
                    model.nodeCollection.reset(data[model.get('parent_nodeId')].nodes);
                },
                error: function(jqXHR,textStatus,errorThrown) {
                    trace('###### Load failed');
                    trace(jqXHR);
                    trace(textStatus);
                    trace(errorThrown);
                }
            });
        }
    });
})(jQuery);