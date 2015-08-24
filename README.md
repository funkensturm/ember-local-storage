# ember-local-storage

[![Build Status](https://api.travis-ci.org/funkensturm/ember-local-storage.svg?branch=master)](https://travis-ci.org/funkensturm/ember-local-storage)

An addon for ember-cli that provides sessionStorage and localStorage object and array in your ember-cli app.

The idea was taken from Tom Dale's gist [Ember Array that writes every change to localStorage](https://gist.github.com/tomdale/11360257) and extended to objects.

It supports:
* sessionStorage
* localStorage
* Object
* Array


## Installation

* `ember install ember-local-storage`

## Changelog

### 0.0.6
* [BUGFIX] Make sure that the changes are persisted on `StorageArray.reset()`
* [ENHANCEMENT] Calling `StorageObject.isInitialContent()` and `StorageArray.isInitialContent()` returns a boolean that indicates if the content was mutated
* [ENHANCEMENT] Calling `StorageObject.clear()` and `StorageArray.clear()` removes the data from xStorage
* [ENHANCEMENT] Adds `setProperties` on `StorageObject`

### 0.0.5
* [ENHANCEMENT] Prototype extensions are now disabled and the `StorageArray` always returns an `Ember.Array` [@miguelcobain](https://github.com/miguelcobain)
* [ENHANCEMENT] Calling `StorageObject.reset()` and `StorageArray.reset()` resets to `initialContent` [@miguelcobain](https://github.com/miguelcobain)

### 0.0.4
* [BUGFIX] Fixes safari private mode exposes xStorage but fails on setItem

### 0.0.3
* [BUGFIX] Prevents content sharing for objects and arrays [@glagola](https://github.com/glagola)
* [BUGFIX] Prevents the creation of a key `null` with the content `null` if the object is created with arguments
* [ENHANCEMENT] Adds in-memory fallback for `localStorage` and `sessionStorage`

### 0.0.2
* [ENHANCEMENT] `sessionStorage` added
* [ENHANCEMENT] Usage of `localStorageKey` is deprecated use `storageKey` instead.
* [BREAKING] localStorage array and object location changed
	* `ember-local-storage/object` -> `ember-local-storage/local/object`
	* `ember-local-storage/array` -> `ember-local-storage/local/array`

## Usage

### Object & Array

#### Object

```javascript
// app/models/settings.js
import StorageObject from 'ember-local-storage/local/object';
// or use sessionStorage
// `import StorageObject from 'ember-local-storage/session/object';`

export default StorageObject.extend({
  storageKey: 'your-app-settings',
  initialContent: {
    welcomeMessageSeen: false
  }
});
```

```javascript
// app/controllers/application.js
import Ember from 'ember';
import Settings from 'your-app/models/settings';

export default Ember.Controller.extend({
  settings: Settings.create(),

  actions: {
	hideWelcomeMessage: function() {
		this.set('settings.welcomeMessageSeen', true);
	}
  }
});
```

```handlebars
{{! app/templates/application.hbs}}
{{#unless settings.welcomeMessageSeen}}
  Welcome message.
  <button {{action "hideWelcomeMessage"}}>X</button>
{{/unless}}
```

#### Array

```javascript
// app/models/anonymous-likes.js
import StorageArray from 'ember-local-storage/local/array';
// or use sessionStorage
// `import StorageArray from 'ember-local-storage/session/array';`

export default StorageArray.extend({
  storageKey: 'your-app-anonymous-likes'
});
```

```javascript
// app/controllers/item.js
import Ember from 'ember';
import AnonymousLikes from 'your-app/models/anonymous-likes';

export default Ember.ObjectController.extend({
  anonymousLikes: AnonymousLikes.create(),

  isLiked: computed('id', function() {
	return this.get('anonymousLikes').contains(this.get('id'));
  }),

  actions: {
	like: function() {
		this.get('anonymousLikes').addObject(this.get('id'));
	}
  }
});
```

```handlebars
{{! app/templates/item.hbs}}
{{#unless isLiked}}
  <button {{action "like"}}>Like it</button>
{{else}}
  You like it!
{{/unless}}
```

#### Methods

The following methods work on `StorageObject` and `StorageArray`

**.isInitialContent()**

You can call `.isInitialContent()` to determine if `content` is equal to `initialContent`.
Returns a boolean.

**.reset()**

You can invoke `.reset()` to reset the `content` to the `initialContent`.

**.clear()**

You can invoke `.clear()` to remove the `content` from xStorage.

### Adapter & Serializer

If your app is a pure LocalStorage app you just need to create the application adapter and serializer:

```javascript
// app/adapters/application.js
export { default } from 'ember-local-storage/adapters/adapter';

// app/serializers/application.js
export { default } from 'ember-local-storage/serializers/serializer';
```

If you already use Ember Data for non LocalStorage models you can use a per type adapter and serializer.

```javascript
// app/adapters/post.js
export { default } from 'ember-local-storage/adapters/adapter';

// app/serializers/post.js
export { default } from 'ember-local-storage/serializers/serializer';
```

#### Export & Import

The addon ships with an initializer that enables export and import of you LocalStorage data.
You have to add `fileExport` option to the `environment.js`:

```javascript
// config/environment.js
module.exports = function() {
  var ENV = {
    'ember-local-storage': {
      fileExport: true
    }
  }
};
```

The initializer provides `exportData()` and `importData()` on the store. Both return a Promise.

```javascript
import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  readFile: function(file) {
    const reader = new FileReader();

    return new Ember.RSVP.Promise((resolve) => {
      reader.onload = function(event) {
        resolve({
          file: file.name,
          type: file.type,
          data: event.target.result,
          size: file.size
        });
      };

      reader.readAsText(file);
    });
  },
  actions: {
    importData: function(event) {
      this.readFile(event.target.files[0])
        .then((file) => {
          this.store.importData(file.data);
        });
    },
    exportData: function() {
      this.store.exportData(
        ['posts', 'comments'],
        {download: true, filename: 'my-data.json'}
      );
    }
  }
});
```

**importData(content, options)**
`content` can be a JSON API compiliant object or a JSON string
`options` are:
- `json` Boolean (default `true`)
- `truncate` Boolean (default `true`) if `true` the existing data gets replaced.

**exportData(types, options)**
`types` Array of types to export. The types must be pluralized.
`options` are:
- `json` Boolean (default `true`)
- `download` Boolean (default `false`)
- `filename` String (default ember-data.json)

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Publishing

```bash
ember release
npm publish
```
