# Ember localStorage

[![Build Status](https://api.travis-ci.org/funkensturm/ember-local-storage.svg?branch=master)](https://travis-ci.org/funkensturm/ember-local-storage)
[![Ember Observer Score](http://emberobserver.com/badges/ember-local-storage.svg)](http://emberobserver.com/addons/ember-local-storage)
[![Greenkeeper badge](https://badges.greenkeeper.io/funkensturm/ember-local-storage.svg)](https://greenkeeper.io/)


The addon provides a `storageFor` computed property that returns a proxy and persists the changes to localStorage or sessionStorage. It works with objects and arrays and has a generator to create the proxy objects or arrays.

It ships with an ember-data adapter that works almost the same as the JSONAPIAdapter with some relationship sugar added.

The idea was taken from Tom Dale's gist [Ember Array that writes every change to localStorage](https://gist.github.com/tomdale/11360257) and extended to objects.
The `storageFor` API was inspired by [Ember State Services](https://github.com/stefanpenner/ember-state-services).

## Installation

* `ember install ember-local-storage`

## Changelog

The documentation is for versions `>= 1.0.0` if you are looking for older versions look [here](https://github.com/funkensturm/ember-local-storage/tree/v0.1.5#readme).

If you upgrade from a version `<= 0.1.5` you need to set a `legacyKey` on the computed `storageFor`:
```javascript
export default Ember.Component.extend({
  settings: storageFor('settings', { legacyKey: 'your-old-key' })
});
```

See the [CHANGELOG](CHANGELOG.md)

## Usage

* [Configuration](#configuration)
* [Object & Array](#object--array)
  * [Object](#object)
  * [Array](#array)
  * [storageFor](#storagefor-options)
  * [Methods](#methods)
* [Adapter & Serializer](#adapter--serializer)
  * [Model](#model)
  * [.query() & .queryRecord()](#query--queryrecord)
  * [Import & Export of localStorage records](#export--import)

### Configuration

Global configuration can be set in your app's `config/environment.js`. E.g.

```js
// config/environment.js
module.exports = function() {
  var ENV = {
    'ember-local-storage': {
      // Config options belong here
    }
  }
};
```

#### Namespace & keyDelimiter

You can set `namespace` and `keyDelimiter` options. For backward compatibility this is a opt-in feature.

**Important:** Don't turn this feature on for existing apps. You will lose access to existing keys.

To activate it there are the following options:

- `namespace` can be `true` or a string. If set to `true` it will use `modulePrefix` as the namespace
- `keyDelimiter` is a string. The default is `:`

```js
// config/environment.js
module.exports = function() {
  var ENV = {
    modulePrefix: 'my-app',
    'ember-local-storage': {
      namespace: true, // will use the modulePrefix e.g. 'my-app'
      namespace: 'customNamespace', // will use 'customNamespace'
      keyDelimiter: '/' // will use / as a delimiter - the default is :
    }
  }
};
```

#### ember-data support

This addon autodetects if you use ember-data and will include the support for ember-data adapters and serializes by default. You can opt out of this behavior by setting the `includeEmberDataSupport` option to `false`:

```js
// config/environment.js
module.exports = function() {
  var ENV = {
    modulePrefix: 'my-app',
    'ember-local-storage': {
      includeEmberDataSupport: false
    }
  }
};
```

NOTE: However, there are environments where the detection fails and the support is disabled when you really do want it. A common place you might run into this is on https://ember-twiddle.com. For that case you can force including support for ember-data by turn this option on. Edit the `twiddle.json` to include the following:

```json
  "ENV": {
    "ember-local-storage": {
      "includeEmberDataSupport": true
    }
  },
```

#### Window Sync

You can set the `syncWindows` option to `false` to disable immediate syncing across windows or tabs. The default is `true`.

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
    return this.get('anonymousLikes').includes(this.get('id'));
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
- `legacyKey` String - **Deprecated see [Deprecations](#deprecations)**


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
export { default } from 'ember-local-storage/adapters/local';
// or export { default } from 'ember-local-storage/adapters/session';

// app/serializers/application.js
export { default } from 'ember-local-storage/serializers/serializer';
```

If you already use Ember Data for non LocalStorage models you can use a per type adapter and serializer.

```javascript
// app/adapters/post.js
export { default } from 'ember-local-storage/adapters/local';
// or export { default } from 'ember-local-storage/adapters/session';

// app/serializers/post.js
export { default } from 'ember-local-storage/serializers/serializer';
```

If you use namespaced models e.g. `blog/post` you have to add the `modelNamespace` property to the corresponding adapter:

```js
// app/adapters/blog/post.js
import Adapter from 'ember-local-storage/adapters/local';
// or import Adapter from 'ember-local-storage/adapters/session';

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

## Test Helpers

`ember-local-storage` provides a helper to reset the storage while testing. This could be very useful when part of the
logic you are testing depends on the information in the storage.


Take a look at the following acceptance tests.

```javascript

// ember-mocha

import { describe, afterEach } from 'mocha';
import { setupApplicationTest } from 'ember-mocha';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import resetStorages from 'ember-local-storage/test-support/reset-storage';

describe('Acceptance | login page', function() {
  let hooks = setupApplicationTest();
  setupMirage(hooks);

  afterEach(function() {
    if (window.localStorage) {
      window.localStorage.clear();
    }
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
    resetStorages();
  });

  it('visiting a place', async function() {
    // your test goes here.
  });
});

// ember-qunit

import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, currentURL } from '@ember/test-helpers';
import resetStorages from 'ember-local-storage/test-support/reset-storage';

module('basic acceptance test', function(hooks) {
  let hooks = setupApplicationTest(hooks);

  hooks.afterEach(function() {
    if (window.localStorage) {
      window.localStorage.clear();
    }
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
    resetStorages();
  });

  test('can visit /', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
  });
});

```

## Deprecations

### storageFor - legacyKey
until: 2.0.0

id: ember-local-storage.storageFor.options.legacyKey

Using `legacyKey` has been deprecated and will be removed in version 2.0.0. You should migrate your key to the new format. For `storageFor('settings')` that would be `storage:settings`.


## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## Ember support

* Ember.js v2.12 or above
* Ember CLI v2.13 or above


## Publishing

```bash
ember github-pages:commit --message "New gh-pages release"

ember release
npm publish
```

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
