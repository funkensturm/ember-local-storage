# Changelog

## 1.1.1
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
