# Changelog

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
