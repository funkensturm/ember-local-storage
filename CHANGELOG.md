# Changelog





## v2.0.6 (2023-07-30)

#### :bug: Bug Fix
* [#375](https://github.com/funkensturm/ember-local-storage/pull/375) Ember v5 drops `@ember/polyfills`. Remove non-existent keys polyfill ([@stevensona](https://github.com/stevensona))

#### Committers: 1
- Adam Stevenson ([@stevensona](https://github.com/stevensona))


## v2.0.5 (2023-05-14)

#### :bug: Bug Fix
* [#372](https://github.com/funkensturm/ember-local-storage/pull/372) Deprecate initializer ([@fsmanuel](https://github.com/fsmanuel))

#### :house: Internal
* [#373](https://github.com/funkensturm/ember-local-storage/pull/373) Update ember-cli to v4.4 ([@fsmanuel](https://github.com/fsmanuel))
* [#372](https://github.com/funkensturm/ember-local-storage/pull/372) Deprecate initializer ([@fsmanuel](https://github.com/fsmanuel))
* [#371](https://github.com/funkensturm/ember-local-storage/pull/371) Deprecate import-export mixin ([@fsmanuel](https://github.com/fsmanuel))
* [#369](https://github.com/funkensturm/ember-local-storage/pull/369) Don't patch Ember Data unless file export is needed ([@mwpastore](https://github.com/mwpastore))
* [#370](https://github.com/funkensturm/ember-local-storage/pull/370) Test coverage from 3.16 to 4.8 ([@fsmanuel](https://github.com/fsmanuel))
* [#363](https://github.com/funkensturm/ember-local-storage/pull/363) Change ember-data import to @ember-data ([@fsmanuel](https://github.com/fsmanuel))

#### Committers: 2
- Manuel Wiedenmann ([@fsmanuel](https://github.com/fsmanuel))
- Mike Pastore ([@mwpastore](https://github.com/mwpastore))


## v2.0.4 (2022-09-04)

#### :memo: Documentation
* [#358](https://github.com/funkensturm/ember-local-storage/pull/358) Update demo app ([@fsmanuel](https://github.com/fsmanuel))

#### :house: Internal
* [#362](https://github.com/funkensturm/ember-local-storage/pull/362) Improve Linting ([@fsmanuel](https://github.com/fsmanuel))
* [#360](https://github.com/funkensturm/ember-local-storage/pull/360) Bump node version to 14 for CI ([@fsmanuel](https://github.com/fsmanuel))
* [#359](https://github.com/funkensturm/ember-local-storage/pull/359) Fix deprecation: `ember-data:deprecate-snapshot-model-class-access`. ([@wuron](https://github.com/wuron))
* [#357](https://github.com/funkensturm/ember-local-storage/pull/357) Update dependencies ([@fsmanuel](https://github.com/fsmanuel))
* [#356](https://github.com/funkensturm/ember-local-storage/pull/356) Drop ember-cli-release and ember-cli-github-pages ([@fsmanuel](https://github.com/fsmanuel))

#### Committers: 2
- Alexander Chepurnoy ([@wuron](https://github.com/wuron))
- Manuel Wiedenmann ([@fsmanuel](https://github.com/fsmanuel))


## v2.0.3 (2022-08-27)

#### :memo: Documentation
* [#352](https://github.com/funkensturm/ember-local-storage/pull/352) Fix `LinkTo`'s ([@charlesfries](https://github.com/charlesfries))

#### :house: Internal
* [#355](https://github.com/funkensturm/ember-local-storage/pull/355) Add release-it and release-it-lerna-changelog ([@fsmanuel](https://github.com/fsmanuel))
* [#354](https://github.com/funkensturm/ember-local-storage/pull/354) Replace http with https ([@fsmanuel](https://github.com/fsmanuel))
* [#351](https://github.com/funkensturm/ember-local-storage/pull/351) Remove bower ([@charlesfries](https://github.com/charlesfries))
* [#353](https://github.com/funkensturm/ember-local-storage/pull/353) Update codeql-analysis.yml ([@fsmanuel](https://github.com/fsmanuel))

#### Committers: 2
- Charles Fries ([@charlesfries](https://github.com/charlesfries))
- Manuel Wiedenmann ([@fsmanuel](https://github.com/fsmanuel))

## 2.0.2
* [FIX] Remove `assign` usage to silence deprecation warning [#347](https://github.com/funkensturm/ember-local-storage/pull/347). Thanks to [@charlesfries](https://github.com/charlesfries) for the PR.
* [FIX] Fix regex in ember data version check in serializer [#348](https://github.com/funkensturm/ember-local-storage/pull/348). Thanks to [@wozny1989](https://github.com/wozny1989) for the PR.

## 2.0.1
* [CHORE] Remove 2.0 deprecations [#339](https://github.com/funkensturm/ember-local-storage/pull/339)

## 2.0.0
* [ENHANCEMENT] Update `ember-cli` to `3.28` + update dependencies. Drops test coverage for ember versions < `3.4`
* [ENHANCEMENT] Update `ember-copy` to v2 - Allows to use `ember-cli-babel` v7. Thanks to [@GreatWizard](https://github.com/GreatWizard) for reporting.
* [FIX] Use `get` to retrieve the dependent model [#331](https://github.com/funkensturm/ember-local-storage/issues/330). Thanks to [@rnuyts](https://github.com/rnuyts) for reporting.

## 1.7.2
* [FIX] Fix performance issue in `importData()` with `truncate` option. Thanks to [@koopa](https://github.com/koopa) for the PR.

## 1.7.1
* [FIX] Fix dependency injections in storages. Thanks to [@svenpl](https://github.com/svenpl) for the PR.
* [FIX] Fix replace removeEventHandler by removeEventListener. Thanks to [@cibernox](https://github.com/cibernox) for the PR.

## 1.7.0
* [ENHANCEMENT] Change `includeEmberDataSupport` configuration option behavior to opt out OR force ember-data support. Thanks to [@jasonmit](https://github.com/jasonmit) for the PR.

## 1.6.0
* [ENHANCEMENT] Add configuration option to add a namespace for localStorage keys.
* [ENHANCEMENT] Add configuration option to force ember-data support. Thanks to [@sukima](https://github.com/sukima) for the PR.

## 1.5.0
* [ENHANCEMENT] Provide `resetStorages` test helper. Thanks to [@dmuneras](https://github.com/dmuneras) for the PR.
* [FIX] Fix test coverage. Thanks to [@CvX](https://github.com/CvX) for the PR.

## 1.4.2
* [FIX] Remove copy deprecation warnings. Thanks to [@selvaa89](https://github.com/selvaa89) for the PR.
* [FIX] Fix broken `autoSave` option for ember-data versions > 3.0.X.

## 1.4.1
* [FIX] Remove singularize + pluralize deprecation warnings. Thanks to [@eharrow](https://github.com/eharrow) and [@CvX](https://github.com/CvX) for the PRs.

## 1.4.0
* [FIX] Namespaces storage based on type key if `storageFor`s `model` option is used. Thanks to [@offirgolan](https://github.com/offirgolan) for the PR.
* [ENHANCEMENT] Moving blob-polyfill dependency from bower to npm. You can remove the bower dependency if its not needed by other code. Thanks to [@gmurphey](https://github.com/gmurphey) for the PR.

## 1.3.7
* [FIX] `storageFor`s `model` option now supports latest ember-data models. Thanks to [@offirgolan](https://github.com/offirgolan) for the PR.

## 1.3.6
* [FIX] Fix broken import/export and decouple the methods from the adapter. Thanks to [@bendemboski](https://github.com/bendemboski) for the PR.

## 1.3.5
* [FIX] Raise AdapterError on not found. Thanks to [@bendemboski](https://github.com/bendemboski) for the PR.
* [FIX] tryStorage now returns undefined instead of null. Thanks to [@xcambar](https://github.com/xcambar) for the PR.

## 1.3.4
* [FIX] Remove getOwner deprecation. Thanks to [@bendemboski](https://github.com/bendemboski) for the PR.
* [FIX] Don't leak _indices into registry. Thanks to [@bendemboski](https://github.com/bendemboski) for the PR.
* [FIX] Remove _shouldSerializeHasMany deprecation.

## 1.3.3
* [FIX] Return undefined instead of null on queryFilter via queryRecord. Thanks to [@bncoelho](https://github.com/bncoelho) for the PR.

## 1.3.2
* [FIX] Prevent leaking event listenes during testing. Thanks to [@rwjblue](https://github.com/rwjblue) for the PR.

## 1.3.1
* [ENHANCEMENT] Replace `Ember.merge` with `Ember.assign` `[deprecation id: ember-metal.merge]`. Thanks to [@aharita](https://github.com/aharita) for the PR.

## 1.3.0
* [ENHANCEMENT] Add `session` adapter. Thanks to [@schickm](https://github.com/schickm) for the implementation.

## 1.2.0
* [ENHANCEMENT] A `queryRecord()` for empty results now returns `null` for ember-data versions >= 2.2.X. Thanks to [EmberHH Hack Night](https://www.meetup.com/de-DE/emberHH/events/230984832/) for the time to fix this.

## 1.1.0
* [ENHANCEMENT] Allow namespaced models. See the [README](https://github.com/funkensturm/ember-local-storage#adapter--serializer) for more information. Thanks to [@juni0r](https://github.com/juni0r) for requesting.

## 1.0.1
* [ENHANCEMENT] Use `getOwner` polyfill to remove deprecations. Thanks to [@kepek](https://github.com/kepek) for implementing.

## 1.0.0
* [ENHANCEMENT] New `storageFor` API. See the README for more information.
* [BREAKING] Not sure if the release is breaking. If so please open an issue.

## 0.1.5
* [BUGFIX] Fixes detection of `ember-data >= 2.3.0` now that it is an addon (npm package). Thanks to [@Arkham](https://github.com/Arkham) for reporting.

## 0.1.4
* [BUGFIX] Allow querying on boolean attributes that are false. Thanks to [@Ramblurr](https://github.com/Ramblurr) for reporting and [@bekzod](https://github.com/bekzod) for fixing.

## 0.1.3
* [BUGFIX] Prevents infinite loop in IE 11 if the storage event fires in the same tab. Thanks to [@MattNguyen](https://github.com/MattNguyen) for reporting.

## 0.1.2
* [BUGFIX] Prevents the value to become `null` if the `newValue` of the storage event is `undefined` or `null`.
* [BUGFIX] Prevents infinite loop in IE 11 if the storage event fires in the same tab.

## 0.1.1
* [BUGFIX] fixes `store.push()` to persist the pushed payload [@Ramblurr](https://github.com/Ramblurr)
* [BUGFIX] normalize query filter keys (`bookPublication` -> `book-publication`) thanks to [@Ramblurr](https://github.com/Ramblurr) for reporting
* [BUGFIX] fixes `queryRecord()` for empty results. The behavior is still irritating because in case of no match we return an empty array. It's an issue with ember-data. See [#3790](https://github.com/emberjs/data/issues/3790) as soon as [#3866](https://github.com/emberjs/data/pull/3866) makes it into a release `queryRecord()` will return `null`. Thanks to [@Ramblurr](https://github.com/Ramblurr) for reporting.

## 0.1.0
* [ENHANCEMENT] Add `query` & `queryRecord` thanks to [@robbiespeed](https://github.com/robbiespeed) for pairing
* [ENHANCEMENT] Sync storage across tabs [@davewasmer](https://github.com/davewasmer)

## 0.0.10
* [BUGFIX] Do not crash if ember-data isn't present

## 0.0.9
* [BUGFIX] Checks if ember-data >= 1.13.0

## 0.0.8
* [BUGFIX] Fixes an issue with the app config not beein present

## 0.0.7
* [ENHANCEMENT] Adds `Adapter` & `Serializer` see [Adapter & Serializer](https://github.com/funkensturm/ember-local-storage/blob/master/README.md#adapter--serializer)

## 0.0.6
* [BUGFIX] Make sure that the changes are persisted on `StorageArray.reset()`
* [ENHANCEMENT] Calling `StorageObject.isInitialContent()` and `StorageArray.isInitialContent()` returns a boolean that indicates if the content was mutated
* [ENHANCEMENT] Calling `StorageObject.clear()` and `StorageArray.clear()` removes the data from xStorage
* [ENHANCEMENT] Adds `setProperties` on `StorageObject`

## 0.0.5
* [ENHANCEMENT] Prototype extensions are now disabled and the `StorageArray` always returns an `Ember.Array` [@miguelcobain](https://github.com/miguelcobain)
* [ENHANCEMENT] Calling `StorageObject.reset()` and `StorageArray.reset()` resets to `initialContent` [@miguelcobain](https://github.com/miguelcobain)

## 0.0.4
* [BUGFIX] Fixes safari private mode exposes xStorage but fails on setItem

## 0.0.3
* [BUGFIX] Prevents content sharing for objects and arrays [@glagola](https://github.com/glagola)
* [BUGFIX] Prevents the creation of a key `null` with the content `null` if the object is created with arguments
* [ENHANCEMENT] Adds in-memory fallback for `localStorage` and `sessionStorage`

## 0.0.2
* [ENHANCEMENT] `sessionStorage` added
* [ENHANCEMENT] Usage of `localStorageKey` is deprecated use `storageKey` instead.
* [BREAKING] localStorage array and object location changed
	* `ember-local-storage/object` -> `ember-local-storage/local/object`
	* `ember-local-storage/array` -> `ember-local-storage/local/array`
