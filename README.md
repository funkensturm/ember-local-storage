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

### 0.0.5
* [ENHANCEMENT] Prototype extensions are now disabled and the `StorageArray` always returns an `Ember.Array` @miguelcobain
* [ENHANCEMENT] Calling `StorageObject.reset()` and `StorageArray.reset()` resets to `initialContent` @miguelcobain

### 0.0.4
* [BUGFIX] Fixes safari private mode exposes xStorage but fails on setItem

### 0.0.3
* [BUGFIX] Prevents content sharing for objects and arrays
* [BUGFIX] Prevents the creation of a key `null` with the content `null` if the object is created with arguments
* [ENHANCEMENT] Adds in-memory fallback for `localStorage` and `sessionStorage`

### 0.0.2
* [ENHANCEMENT] `sessionStorage` added
* [ENHANCEMENT] Usage of `localStorageKey` is deprecated use `storageKey` instead.
* [BREAKING] localStorage array and object location changed
	* `ember-local-storage/object` -> `ember-local-storage/local/object`
	* `ember-local-storage/array` -> `ember-local-storage/local/array`

## Usage

### Object

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

### Array

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

### .reset()

You can call `StorageObject.reset()` and `StorageArray.reset()` to reset the `content` to the `initialContent`.

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
npm version 0.0.X
git push origin master
git push origin --tags
npm publish
```
