window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    // ember-data is responsible for that
    { handler: "silence", matchMessage: "Ember.create is deprecated in favor of Object.create" },
    { handler: "silence", matchMessage: "Usage of `typeKey` has been deprecated and will be removed in Ember Data 2.0. It has been replaced by `modelName` on the model class." }
  ]
};