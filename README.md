# SplitMe

[![wercker status](https://app.wercker.com/status/5ad10e66eced6a3bfc139f962105324e/m/master "wercker status")](https://app.wercker.com/project/bykey/5ad10e66eced6a3bfc139f962105324e)

## Install

```sh
npm install -g grunt-cli pouchdb-server
npm install
cd cordova
cordova prepare
```
### Test

```sh
npm install selenium-standalone -g
selenium-standalone install
```

### Android

```sh
brew install android-sdk
```

## Dev

```sh
npm start
pouchdb-server
```

## Environement

### Production
- Browser [splitme.net](https://splitme.net)
- Android [Google Play](https://play.google.com/store/apps/details?id=com.split.app)

### Staging
- Browser [staging.splitme.net](https://staging.splitme.net)

## Action name

Use the [FSA](https://github.com/acdlite/flux-standard-action) standard.

use action name linked to the action triggered by the user. The action name shouldn't be link to the mutation of the store needed.

Exception, the action is used in only one reducer and the mutation is duplicated by other action in this same reducer. Then the action name can be linked to the store mutation
