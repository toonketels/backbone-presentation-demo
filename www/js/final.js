(function(Backbone, _, $) {
  "use strict";



  /**
   * Models...
   */


  /**
   * Person model
   */
  var Person = Backbone.Model.extend({

    defaults: {
      country: "Belgium",
      job: "Sales"
    },

    idAttribute: 'uid',

    validate: function(attributes, options) {
      if (typeof attributes.age !== "number") {
        return "Age should be a number";
      }
    }

  });



  /**
   * Collections...
   */


  /**
   * Coworkers collection.
   */
  var Coworkers = Backbone.Collection.extend({

    model: Person,

    // Specify url so we can 'fetch' the collection.
    // This means backbone will perform an ajax
    // request for us and pass the json to the
    // collection to create models.
    url: 'people',

    initialize: function() {
      
      // Create this as property of instance,
      // not of its prototype;
      this.currentSort = 'uid';
    },

    comparator: 'uid',

    sortName: function() {
      this.comparator = this.currentSort = 'name',
      this.sort();
    },

    sortUid: function() {
      this.comparator = this.currentSort = 'uid';
      this.sort();
    },

    sortCountry: function() {
      this.comparator = this.currentSort = 'country';
      this.sort();
    },

    sortAge: function() {
      this.comparator = this.currentSort = 'age';
      this.sort();
    },

    sortJob: function() {
      this.comparator = this.currentSort = 'job';
      this.sort();
    }

  });
  


  /**
   * Views...
   */


  /**
   * Full view person.
   */
  var PersonView = Backbone.View.extend({

   'className': 'person-view',

    initialize: function() {

      this.listenTo(this.model, 'change', function() {
        // Exclude for selected, expanded
        if (typeof this.model.changed['selected'] === 'undefined' &&
            typeof this.model.changed['expanded'] === 'undefined') {
          this.render();
        }
      });

      this.listenTo(this.model, 'change:expanded', this.toggleBio);
    },

    template: _.template( $('#person-view').html() ),

    render: function() {
    
      var content = this.template( this.model.toJSON() );
      this.$el.html(content);

      // Set correct hide classes on bio and button
      this.initDisplayBio();

      return this;
    },

    events: {
      'click .more':        'showMore',
      'click .less':        'showLess',
      'click h2':           'selectPerson',
      'mouseover':          'startHighlight',
      'mouseout':           'stopHighlight'
    },

    showMore: function(event) {
      this.model.set('expanded', true);
    },

    showLess: function(event) {
      this.model.set('expanded', false);
    },

    goToDetail: function(event) {
      window.alert('Go to detail of ' + this.model.get('name'));
    },

    selectPerson: function(event) {
      if (this.model.get('selected')) {
        this.model.set('selected', false);
      } else {
        this.model.set('selected', true);
      }
    },

    startHighlight: function(event) {
      this.$el.addClass('highlight');
    },

    stopHighlight: function(event) {
      this.$el.removeClass('highlight');
    },

    initDisplayBio: function() {
      if (this.model.get('expanded')) {
        this.$('.controls span.more').addClass('hide');
      } else {
        this.$('.controls span.less').addClass('hide');
        this.$('.bio').addClass('hide');
      }
    },

    toggleBio: function() {
      if (this.model.get('expanded')) {
        this.$('.bio').slideDown('medium');
        this.$('.controls span').toggleClass('hide');
      } else {
        this.$('.bio').slideUp('medium');
        this.$('.controls span').toggleClass('hide');
      }
    }

  });



  /**
   * Person List view
   */
  var PersonListView = Backbone.View.extend({

    initialize: function() {
      this.views = [];
      this.listenTo(this.collection, 'reset', this.render, this);
      this.listenTo(this.collection, 'sort', this.render, this);
    },

    render: function() {

      // Remove the subviews...
      _.each(this.views, function(view) {
        view.remove();
      });
      this.views = [];

      // Render all the children
      this.collection.each(function(person) {
        var view = new PersonView({model: person});
        this.$el.append( view.render().el );

        // Keep a ref to the view.
        this.views.push(view);
      }, this);

      return this;
    }

  });


  /**
   * Button view.
   */
  var ButtonView = Backbone.View.extend({

    className: 'btn-group',

    template: _.template( $('#button-view').html() ),

    initialize: function() {
      this.listenTo(this.collection, 'reset', this.setButtonActive, this);
      this.listenTo(this.collection, 'sort', this.setButtonActive, this);
    },

    render: function() {
      this.$el.html( this.template() );
      return this;
    },

    events: {
      'click .name': 'sortName',
      'click .age': 'sortAge',
      'click .job': 'sortJob',
      'click .uid': 'sortUid'
    },

    sortName: function() {
      this.collection.sortName();
    },

    sortAge: function() {
      this.collection.sortAge();
    },

    sortJob: function() {
      this.collection.sortJob();
    },

    sortUid: function() {
      this.collection.sortUid();
    },

    setButtonActive: function() {
      var active = this.collection.currentSort;

      this.$('.btn').removeClass('active');
      this.$('.'+active).addClass('active');
    }

  });



  /**
   * Table summary row view persons.
   */
  var TableRowView = Backbone.View.extend({

    tagName: 'tr',

    initialize: function() {
      this.listenTo(this.model, 'change:selected', this.render);
      this.listenTo(this.model, 'change:name', this.render);
    },

    template: _.template( $('#table-row-view').html() ),

    render: function() {
      var content = {
        selected: this.model.get('selected') ? 'selected' : '',
        title: this.model.get('name')
      };
      this.$el.html( this.template( content ) );

      return this;
    },

  });


  /**
   * Table summary view persons.
   */
  var TableView = Backbone.View.extend({

    tagName: 'table',

    className: 'table table-striped',

    template: _.template( $('#table-view').html() ),

    initialize: function() {
      this.listenTo(this.collection, 'reset', this.render);
      this.views = [];
    },

    render: function() {
      this.$el.html( this.template() );

      // Render all the children
      this.collection.each(function(person) {
        var view = new TableRowView({model: person});
        this.$('tbody').append( view.render().el );
        this.views.push(view);
      }, this);

      return this;
    }
  })



  /**
   * Application view.
   */
  var App = Backbone.View.extend({
  
    'el': $('#app'),

    template: _.template( $('#app-view').html() ),

    initialize: function() {
      this.initCoworkersCollection();
      this.render();
    },

    render: function() {
      this.$el.html( this.template() );

      this.displayPersonListView();
      this.displayButtonView();
      this.displayTableView();
    },

    initCoworkersCollection: function() {
      this.coworkers = new Coworkers();
      this.coworkers.fetch({reset: true});
    },

    displayPersonListView: function() {
      var view = new PersonListView({collection: this.coworkers});
      $('#main').append( view.render().el );
    },

    displayButtonView: function() {
      var view = new ButtonView({collection: this.coworkers});
      $('.control-buttons').append( view.render().el );
    },

    displayTableView: function() {
      var view = new TableView({collection: this.coworkers});
      $('#side').append( view.render().el );
    }

  });



  /**
   * Actually create the application.
   */
  var app = new App();

  // Just so we can reach it via console
  window.app = app;


})(Backbone, _, jQuery);