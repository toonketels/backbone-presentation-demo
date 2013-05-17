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
   * Person view.
   */
  var PersonView = Backbone.View.extend({

    'className': 'person-view',

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {

      var content = '<h2>'+this.model.get('name')+'</h2>';
      this.$el.html(content);

      return this;
    }
  });


  /**
   * Start doing stuff.
   */


  var toon = new Person({
      "name": "Toon Ketels",
      "age": 30,
      "job": "Developer",
      "bio": "<p>Scrum master, backend Drupal developer.</p>",
      "uid": 7544,
      "id": "tk-7544-corl"
  });

  var view = new PersonView({model: toon});
  $('#main').append( view.render().el );

  // Keep reference to model so we can set it
  // from console.
  window.toon = toon;


})(Backbone, _, jQuery);