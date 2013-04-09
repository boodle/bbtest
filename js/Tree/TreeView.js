(function($) {
	$(document).ready(function() {																  // inside a document ready so that the template elemenst will be available

		/**
		 * Master tree view
		 */
		window.TreeView = Backbone.View.extend({

			template: _.template($("#treeView").html()),
			branchesLoaded: 0,
			doneInitialSetup: false,
			currentPath: [],

			/**
			 * Set visibility for the View methods
			 * @return void
			 */
			initialize: function() {
				_.bindAll(this,
					'do_initialSetup',
					'render',
					'render_branch',
					'render_allBranches',
					'animate_back',
					'animate_forward',
					'animate_home',
					'on_branchRemoved',
					'on_clickBack',
					'on_clickHome',
					'on_branchRendered');

				this.model.branchCollection.on('reset', this.render_allBranches);
				this.model.branchCollection.on('change:id', this.render_branch);
				this.model.branchCollection.on('remove', this.on_branchRemoved);
			},

			events: {
				'click .back': 'on_clickBack',
				'click .home': 'on_clickHome',
			},

			do_initialSetup: function(path) {
				if(this.branchesLoaded==0) {															// it's the first time we've hot this page
					this.branchViews = [];
					this.branchesToInitiallyLoad = path.length+1;
					this.bind('branchRendered',this.on_branchRendered);

					this.model.add_branchToTree(0);
					this.currentPath = path;

					for(var i in path) {
						if(parseInt(path[i])>0) {
							this.model.add_branchToTree(path[i]);
						}
					}
				} else {
					if(path.length==0) {																// we've naved back to, or pressed the home button
						this.animate_home();
					} else {
						if(this.currentPath.length > path.length) {
							this.animate_back();
						} else {
							this.model.add_branchToTree(path[path.length-1]);
						}
					}
					this.currentPath = path;
				}

				var viewCount=0;																		// how are we doing with the garbage collection
				for(var i in this.branchViews) { viewCount++; }
			},

			/**
			 * Treeview is empty. Placed so that child objects
			 * known where to be attached to the DOM
			 * @return View
			 */
			render: function() {
				this.$el.html(this.template(this.model.toJSON()));

				return this;
			},

			on_branchRendered: function() {
				this.branchesLoaded++;
				if(!this.doneInitialSetup && this.branchesLoaded>=this.branchesToInitiallyLoad) {
					this.doneInitialSetup = true;
					$('.branch').stop(true,true);
					$('.branch:not(:last-child)').css({left: '-100%'}).addClass('hide');
					$('.branch:last-child').show();
					$('.branch:nth-last-child(2)').show();
					window.backboneApp.hide_loader();
				}
			},

			/**
			 * When the collection is reset, it tends to have a few models added
			 * back in at the reset. This method resets the renders.
			 * @return void
			 */
			render_allBranches: function() {
				this.$('.branches').empty();
				this.branchViews = [];
				this.model.branchCollection.each(this.render_branch);
			},

			/**
			 * Render a single branch
			 * @param node
			 * @return void
			 */
			render_branch: function(branch) {
				if(branch.get('parent_nodeId')==0) {
					this.$('header').animate({top:this.$('header').height()*-1},config.animation.interpageSpeed);		   // hide the nav bar off the top of the page
				} else {
					this.$('header').animate({top:0},config.animation.interpageSpeed);									  // animate the nav bar down
				}
				
				this.branchViews[branch.get('parent_nodeId')] = new BranchView({
					model: branch,
					attributes: { 
						id: 'branch_'+branch.id,
						class: 'branch branch_'+branch.id+' parent_nodeId_'+branch.get('parent_nodeId'),
						branchId: branch.id,
						parent_nodeId: branch.get('parent_nodeId'),
						'data-role': 'page'
					}
				});

				this.$('.branches').append(this.branchViews[branch.get('parent_nodeId')].render().el);
				this.animate_forward(branch.get('parent_nodeId'));
				this.trigger('branchRendered');
			},

			/**
			 * When a branch has been removed from the collection
			 * remove the view
			 */
			on_branchRemoved: function(branch) {
				this.branchViews[branch.get('parent_nodeId')].remove();
			},

			/** 
			 * Back button has been pressed. Animate this branch
			 * off to the right, and pull in the previous branch 
			 * from the left. Then update the treeModel.branchCollection
			 * @return void
			 */
			on_clickBack: function() {
				if(window.treeModel.branchCollection.length==2) {
					this.$('header').animate({top:this.$('header').height()*-1},config.animation.interpageSpeed);		   	// hide the nav bar off the top of the page
				}
				
				history.back();
			},

			animate_forward: function(parent_nodeId) {
				if(this.$('.branch').length > 1){
					this.$('.branch:not(:last-child)').animate(																// animate other branches off to the left
						{left: '-100%'},
						config.animation.interpageSpeed,
						function(){
							$(this).addClass('hide');
							$('#introduction').hide();
							window.scrollTo(0,0);
							window.backboneApp.hide_loader();
						});
				}

				this.branchViews[parent_nodeId].$el.animate({left:0},config.animation.interpageSpeed);
			},

			/**
			 * Do the animate right to left
			 * @return void
			 */
			animate_back: function() {
				var view = this;
				this.$('.branch:nth-last-child(2)').removeClass('hide');													// redisplay the previous branch,
				this.$('.branch:nth-last-child(2)').animate({left: '0'},config.animation.interpageSpeed);				   	// and animate it back on
				this.$('.branch:last-child').animate(																	   	// animate the current branch off to the right
					{left: '100%'},
					config.animation.interpageSpeed,
					function() {
						window.scrollTo(0,0);
						view.model.branchCollection.pop();
						window.backboneApp.hide_loader();
					});
			},

			/** 
			 * Home button has been pressed. Animate this branch
			 * off to the right, and pull in the first branch 
			 * from the left. Then update the treeModel.branchCollection
			 * @return void
			 */
			on_clickHome: function() {
				window.backboneApp.show_loader();
				window.backboneApp.navigateHome();
				this.animate_home();
			},

			animate_home: function() {
				var view = this;

				this.$('header').animate({top:this.$('header').height()*-1},config.animation.interpageSpeed);			   	// hide the nav bar off the top of the page
				$('#introduction').removeClass('hide');																		// re-display the welcome text
				
				this.$('.branch:first-child').show();																	   	// redisplay the first
				this.$('.branch:first-child').animate({left: '0'},config.animation.interpageSpeed);				   			// and animate it back on
				this.$('.branch:last-child').animate(																	   	// animate the current branch off to the right
					{left: '100%'},
					config.animation.interpageSpeed,
					function() {
						window.scrollTo(0,0);
						view.model.branchCollection.reset(view.model.branchCollection.slice(0,1));
						window.backboneApp.hide_loader();
					});
			}
		});
	});
})(jQuery);