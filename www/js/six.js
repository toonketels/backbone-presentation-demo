(function(Backbone, _, $) {
  "use strict";


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
   * Coworker collection.
   */
  var Coworkers = Backbone.Collection.extend({

    model: Person,

    comparator: function(model) {
      return this.compareUid(model);
    },

    compareName: function(model) {
      return model.get('name');
    },

    compareUid: function(model) {
      return model.get('uid');
    },

    compareCountry: function(model) {
      return model.get('country');
    }

  });



  /**
   * Person view.
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
    },

    template: _.template( $('#person-view').html() ),

    render: function() {

      console.log('Render: ' + this.model.get('name'));

      var content = this.template( this.model.toJSON() );
      this.$el.html(content);

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

      this.$('.bio').slideDown('medium');
      this.$('.controls span').toggleClass('hide');
    },

    showLess: function(event) {

      this.$('.bio').slideUp('medium');
      this.$('.controls span').toggleClass('hide');
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
   * Data for collection.
   */
  var source = [
    {
      name: "Toon Ketels",
      age: 30,
      job: "Developer",
      bio: "<p>Scrum master, backend Drupal developer.</p>",
      uid: 7544,
      id: 'tk-7544-corl'
    },
    {
      name: "An Katrien",
      age: 23,
      country: "the Netherlands",
      bio: "<p>Works in Germany. Loves to gamble.</p>",
      uid: 3400,
      id: 'ak-3400-corl'
    },
    {
      name: "Jan Bollen",
      age: 30,
      country: "the Netherlands",
      job: "Product owner",
      bio: "<p>Loves working with team.</p>",
      uid: 410,
      id: 'jb-410-corl'
    }
  ];



  /**
   * Start doing stuff.
   */

  // Create collection
  var coworkers = new Coworkers(source);
  window.coworkers = coworkers;


  // Create the views.
  coworkers.each(function(model){
    var view = new PersonView({model: model});
    $('#main').append( view.render().el );
  });

  coworkers.each(function(model){
    var view = new TableRowView({model: model});
    $('#side tbody').append( view.render().el );
  });

})(Backbone, _, jQuery);