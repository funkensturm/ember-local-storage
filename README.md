# Ember localStorage

[![Build Status](https://github.com/funkensturm/ember-local-storage/actions/workflows/ci.yml/badge.svg)](https://github.com/funkensturm/ember-local-storage/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/ember-local-storage.svg)](https://www.npmjs.com/package/ember-local-storage)
[![Ember Observer Score](https://emberobserver.com/badges/ember-local-storage.svg)](https://emberobserver.com/addons/ember-local-storage)
[![Download](https://img.shields.io/npm/dy/ember-local-storage)](https://www.npmjs.com/package/ember-local-storage)


The addon provides a `storageFor` computed property that returns a proxy and persists the changes to localStorage or sessionStorage. It works with objects and arrays and has a generator to create the proxy objects or arrays.

It ships with an ember-data adapter that works almost the same as the JSONAPIAdapter with some relationship sugar added.

The idea was taken from Tom Dale's gist [Ember Array that writes every change to localStorage](https://gist.github.com/tomdale/11360257) and extended to objects.
The `storageFor` API was inspired by [Ember State Services](https://github.com/stefanpenner/ember-state-services).

## Installation

* `ember install ember-local-storage`

## Compatibility

| Ember   | Addon  | Node    |
|---------|--------|---------|
| >= 3.4  | >= 2.0 | >= 12.x |
| >= 2.12 | < 2.0  | >= 10.x |


## Changelog

See the [CHANGELOG](CHANGELOG.md)

The documentation in this README is for versions `>= 2.0.0`

* Version [1.x](https://github.com/funkensturm/ember-local-storage/tree/v1.7.2#readme)
* Version [0.x](https://github.com/funkensturm/ember-local-storage/tree/v0.1.5#readme)

If you upgrade from a version `<= 0.1.5` you need to set a `legacyKey` on the computed `storageFor`:
```javascript
export default Ember.Component.extend({
  settings: storageFor('settings', { legacyKey: 'your-old-key' })
});
```

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
  * [Import & Export of localStorage records](#import--export)

### Configuration

#### Namespace & keyDelimiter

In you apps `config/environment.js` you can set a `namespace` and a `keyDelimiter`. For backward compatibility this is a opt-in feature.

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

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { storageFor } from 'ember-local-storage';

export default class ApplicationController extends Controller {
  @storageFor('stats') stats;

  @action
  countUp() {
    this.incrementProperty('stats.counter');
  }

  @action
  resetCounter() {
    this.get('stats').clear();
    // or
    // this.get('stats').reset();
    // this.set('stats.counter', 0);
  }
}
```

```handlebars
{{! app/templates/application.hbs}}

<button {{on "click" this.countUp}}>Page Visits: {{stats.counter}}</button>
<button {{on "click" this.resetCounter}}>X</button>
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

import Component from '@glimmer/component';
import { storageFor } from 'ember-local-storage';
import { action } from '@ember/object';

export default class LikeItemComponent extends Component {
  anonymousLikes: storageFor('anonymous-likes'),

  get isLiked() {
    return this.get('anonymousLikes').includes(this.get('id'));
  }),

  @action
  like(id) {
    this.get('anonymousLikes').addObject(id);
  }
}
```

```handlebars
{{! app/templates/components/like-item.hbs}}

{{#unless this.isLiked}}
  <button {{on "click" (fn this.like this.id)}}>Like it</button>
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

export default class BlogPostAdapter extends Adapter {
  modelNamespace = 'blog';
}
```

#### Model

Your model is a `DS.Model` with two new relationship options

```javascript
// app/models/post.js

import Model, { attr, hasMany } from '@ember-data/model';

export default class PostModel extends Model {
  @attr('string') name;

  @hasMany('comment', { dependent: 'destroy' }) comments;
}

// app/models/comment.js

import Model, { attr, belongsTo } from '@ember-data/model';

export default class CommentModel extends Model {
  @attr('string') name;

  @belongsTo('post', { autoSave: true }) post;
});
```

**Options**

- `dependent` can be used in `hasMany` relationships to destroy the child records when the parent record is destroyed.
- `autoSave` can be used in `belongsTo` relationships to update the association on the parent. It's recommended to use it.

#### .query() & .queryRecord()

As per ember [guides](https://guides.emberjs.com/v2.0.0/models/finding-records/#toc_querying-for-multiple-records) you can query for attributes:

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

You can use `queryRecord` to return only one record. See the [guides](https://guides.emberjs.com/v2.0.0/models/finding-records/#toc_querying-for-a-single-record) for an example.

#### Import & Export 

The addon ships with utility functions that enables export and import of you LocalStorage data.
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

Import `exportData()` and `importData()` from `ember-local-storage/helpers/import-export`.
Both return a Promise.

```javascript
import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { importData, exportData } from 'ember-local-storage/helpers/import-export';

export default class IndexRoute extends Route {
  @service store;

  @action
  exportData() {
    exportData(
      this.store,
      ['posts', 'comments'],
      { download: true, filename: 'my-data.json' }
    );
  }

  @action
  importData(event) {
    this.readFile(event.target.files[0]).then((file) => {
      importData(this.store, file.data);
    });
  }

  readFile(file) {
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onload = function(event) {
        resolve({
          file: file.name,
          type: file.type,
          data: event.target.result,
          size: file.size,
        });
      };

      reader.readAsText(file);
    });
  }
}
```

**importData(store, content, options)**

`store` the ember data store

`content` can be a JSON API compliant object or a JSON string

`options` are:
- `json` Boolean (default `true`)
- `truncate` Boolean (default `true`) if `true` the existing data gets replaced.

**exportData(store, types, options)**

`store` the ember data store

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
    assert.strictEqual(currentURL(), '/');
  });
});

```

## Deprecations

### ember-local-storage.initializers.local-storage-adapter
until: 3.0.0

The initializer has been deprecated and will be removed in version 3.0.0. This is due to the fact that `ember-data >= 4.12` will no longer allow to `reopen` the `Store`. To remove the deprecation message you need to use the utility functions provided by the addon:

```javascript
import { importData, exportData } from 'ember-local-storage/helpers/import-export';
```

See the [Export & Import example](#export--import). When you are done you need to set `loadInitializer` to `false`:

```javascript
// config/environment.js
module.exports = function() {
  var ENV = {
    'ember-local-storage': {
      loadInitializer: false
    }
  }
};
```

This will be the default behaviour for apps that use `ember-data >= 4.12`.


### ember-local-storage.mixins.adapters.import-export
until: 3.0.0

Using the import-export mixin has been deprecated and will be removed in version 3.0.0. You should use the utility functions provided by the addon:

```javascript
import { importData, exportData } from 'ember-local-storage/helpers/import-export';
```

See the [Export & Import example](#export--import).


### ember-local-storage.storageFor.options.legacyKey
until: 2.0.0

Using `legacyKey` has been deprecated and will be removed in version 2.0.0. You should migrate your key to the new format. For `storageFor('settings')` that would be `storage:settings`.


## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## Publishing

```bash
npx release-it
npm publish --tag latest
```

## License

This project is licensed under the [MIT License](LICENSE.md).
