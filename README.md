# SplitMe

[![wercker status](https://app.wercker.com/status/5ad10e66eced6a3bfc139f962105324e/m/master "wercker status")](https://app.wercker.com/project/bykey/5ad10e66eced6a3bfc139f962105324e)

## Install

```sh
npm install -g grunt-cli cordova
npm install
cd cordova
mkdir www
cordova prepare
```

## Dev

```sh
npm start
```

## Test

```sh
npm install selenium-standalone@latest -g
sudo selenium-standalone install
```

## Production
- Browser [splitme.net](http://splitme.net)
- Android [Google Play](https://play.google.com/store/apps/details?id=com.split.app)

## Action name

use action name linked to the action triggered by the user. The action name shouldn't be link to the mutation of the store needed.

Exception, the action is used in only one reducer and the mutation is duplicated by other action in this same reducer. Then the action name can be linked to the store mutation
