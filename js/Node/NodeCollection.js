(function($) {

	window.NodeCollection = Backbone.Collection.extend({

		model: window.NodeModel,

		/**
		* Order results by the display_order
		* @return int
		*/
		comparator: function(resultA,resultB) {
			if(parseInt(resultA.get('display_order')) == parseInt(resultB.get('display_order'))) return 0;
			if(parseInt(resultA.get('display_order')) < parseInt(resultB.get('display_order'))) return -1;
			else return 1;
		}
	})
})(jQuery);