# Ember localStorage

[![Build Status](https://api.travis-ci.org/funkensturm/ember-local-storage.svg?branch=master)](https://travis-ci.org/funkensturm/ember-local-storage)
[![Ember Observer Score](http://emberobserver.com/badges/ember-local-storage.svg)](http://emberobserver.com/addons/ember-local-storage)


The addon provides a `storageFor` computed property that returns a proxy and persists the changes to localStorage or sessionStorage. It works with objects and arrays and has a generator to create the proxy objects or arrays.

It ships with an ember-data adapter that works almost the same as the JSONAPIAdapter with some relationship sugar added.

The idea was taken from Tom Dale's gist [Ember Array that writes every change to localStorage](https://gist.github.com/tomdale/11360257) and extended to objects.
The `storageFor` API was inspired by [Ember State Services](https://github.com/stefanpenner/ember-state-services).


## Installation

* `ember install ember-local-storage`

## Changelog

See the [CHANGELOG](CHANGELOG.md)

## Usage

The documentation is for versions `>= 1.0.0` if you are looking for older versions look [here](https://github.com/funkensturm/ember-local-storage/tree/v0.1.5#readme).

If you upgrade from a version `<= 0.1.5` you need to set a `legacyKey` on the computed `storageFor`:
```javascript
export default Ember.Component.extend({
  settings: storageFor('settings', { legacyKey: 'your-old-key' })
});
```
* [Object & Array](#object--array)
 * [Object](#object)
 * [Array](#array)
 * [storageFor](#storagefor-options)
 * [Methods](#methods)
* [Adapter & Serializer](#adapter--serializer)
 * [Model](#model)
 * [.query() & .queryRecord()](#query--queryrecord)
 * [Import & Export of localStorage records](#export--import)

### Object & Array

#### Object

Run `ember g storage -h` for all options.

```shell
ember g storage stats
// will generate a localStorage object

ember g storage stats -s
// will generate a sessionStorage object
```

```javascript
// app/storages/stats.js
import StorageObject from 'ember-local-storage/local/object';

const Storage = StorageObject.extend();

Storage.reopenClass({
  initialState() {
    return { counter: 0 };
  }
});

export default Storage;
```

```javascript
// app/controllers/application.js
import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Controller.extend({
  stats: storageFor('stats'),

  actions: {
    countUp() {
      this.incrementProperty('stats.counter');
    },
    resetCounter() {
      this.get('stats').clear();
      // or
      // this.get('stats').reset();
      // this.set('stats.counter', 0);
    }
  }
});
```

```handlebars
{{! app/templates/application.hbs}}
<button {{action "countUp"}}>Page Visits: {{stats.counter}}</button>
<button {{action "resetCounter"}}>X</button>
```

#### Array

Run `ember g storage -h` for all options.

```shell
ember g storage anonymous-likes -a
// will generate a localStorage array

ember g storage anonymous-likes -a -s
// will generate a sessionStorage array
```

```javascript
// app/storages/anonymous-likes.js
import StorageArray from 'ember-local-storage/local/array';

const Storage = StorageArray.extend();

// Uncomment if you would like to set initialState
// Storage.reopenClass({
//   initialState() {
//     return [];
//   }
// });

export default Storage;
```

```javascript
// app/components/like-item.js
import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Component.extend({
  anonymousLikes: storageFor('anonymous-likes'),

  isLiked: computed('id', function() {
    return this.get('anonymousLikes').contains(this.get('id'));
  }),

  actions: {
    like: function(id) {
      this.get('anonymousLikes').addObject(id);
    }
  }
});
```

```handlebars
{{! app/templates/components/like-item.hbs}}
{{#unless isLiked}}
  <button {{action "like" id}}>Like it</button>
{{else}}
  You like it!
{{/unless}}
```

#### storageFor options

`storageFor(key, model, options)`

`key` String - The filename of the storage (e.g. stats)

`model` Optional string - The dependent property. Must be an ember data model or an object with `modelName` and `id` properties. (It is still experimental)

`options` are:
- `legacyKey` String


#### Methods

The following methods work on `StorageObject` and `StorageArray`

**.isInitialContent()**

You can call `.isInitialContent()` to determine if `content` is equal to `initialState`.
Returns a boolean.

**.reset()**

You can invoke `.reset()` to reset the `content` to the `initialState`.

**.clear()**

You can invoke `.clear()` to remove the `content` from xStorage.

### Adapter & Serializer

**Important:** The Adapter works with ember-data versions >= `1.13` because it depends on `JSONAPIAdapter`.

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

If you use namespaced models e.g. `blog/post` you have to add the `modelNamespace` property to the corresponding adapter:

```js
// app/adapters/blog/post.js
import Adapter from 'ember-local-storage/adapters/adapter';

export default Adapter.extend({
  modelNamespace: 'blog'
});
```

#### Model

Your model is a `DS.Model` with two new relationship options

```javascript
// app/models/post.js
import DS from 'ember-data';

const {
  Model,
  attr,
  hasMany
} = DS;

export default Model.extend({
  name: attr('string'),

  comments: hasMany('comment', { async: true, dependent: 'destroy' })
});

// app/models/comment.js
import DS from 'ember-data';

const {
  Model,
  attr,
  belongsTo
} = DS;

export default Model.extend({
  name: attr('string'),

  post: belongsTo('post', { async: true, autoSave: true })
});
```

**Options**

- `dependent` can be used in `hasMany` relationships to destroy the child records when the parent record is destroyed.
- `autoSave` can be used in `belongsTo` relationships to update the association on the parent. It's recommended to use it.

#### .query() & .queryRecord()

As per ember [guides](http://guides.emberjs.com/v2.0.0/models/finding-records/#toc_querying-for-multiple-records) you can query for attributes:

```js
  // with a string
  this.store.query('post', { filter: { name: 'Just a name' } });

  // or a regex
  this.store.query('post', { filter: { name: /^Just(.*)/ } });
```

Querying relationships also works:

```js
// belongsTo
// get posts from user '123'
this.store.query('post', { filter: { user: '123' } });
this.store.query('post', { filter: { user: { id: '123' } } });
// or regex
this.store.query('post', { filter: { user: /^12/ } });
this.store.query('post', { filter: { user: { id: /^12/ } } });

// belongsTo polymorphic
// get posts from editors
this.store.query('post', { filter: { user: { type: 'editor' } } });
this.store.query('post', { filter: { user: { type: /^ed(.*)ors$/ } } }); // you need to use the plural
// get posts from editor '123'
this.store.query('post', { filter: { user: { id: '123', type: 'editor' } } });
this.store.query('post', { filter: { user: { id: '123', type: /^ed(.*)ors$/ } } }); // you need to use the plural

// hasMany
// get users who've contributed to project.id = 123
this.store.query('user', { filter: { projects: '123' } });
this.store.query('user', { filter: { projects: { id: '123' } } });
// or regex
this.store.query('user', { filter: { projects: /^12/ });
this.store.query('user', { filter: { projects: { id: /^12/ } } });

// hasMany polymorphic
// get users with cats
this.store.query('user', { filter: { pets: { type: 'cat' } } });
// get users with cat '123'
this.store.query('user', { filter: { pets: { id: '123', type: 'cat' } }) };
// get users with cats AND dogs
this.store.query('user', { filter: { pets: [{ type: 'cat' }, { type: 'dog' }] } });
// get users with cats OR dogs
this.store.query('user', { filter: { pets: { type: /cats|dogs/ } } }); // you need to use the plural
```

You can use `queryRecord` to return only one record. See the [guides](http://guides.emberjs.com/v2.0.0/models/finding-records/#toc_querying-for-a-single-record) for an example.

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

`content` can be a JSON API compliant object or a JSON string

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
ember github-pages:commit --message "New gh-pages release"

ember release
npm publish
```
