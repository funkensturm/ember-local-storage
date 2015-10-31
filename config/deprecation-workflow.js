window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    // ember-data is responsible for that
    { handler: "silence", matchMessage: "Ember.create is deprecated in favor of Object.create" }
  ]
};