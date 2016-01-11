<%= importStatement %>

const Storage = <%= baseClass %>.extend();

// Uncomment if you would like to set initialState
// Storage.reopenClass({
//   initialState() {
//     return <%= initialState %>;
//   }
// });

export default Storage;