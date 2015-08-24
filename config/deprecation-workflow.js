window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "The `initialize` method for Application initializer 'export-application-global' should take only one argument - `App`, an instance of an `Application`." },
    { handler: "silence", matchMessage: "The `initialize` method for Application initializer 'ember-inspector-booted' should take only one argument - `App`, an instance of an `Application`." },
    { handler: "silence", matchMessage: "The `initialize` method for Application initializer 'container-debug-adapter' should take only one argument - `App`, an instance of an `Application`." }
  ]
};