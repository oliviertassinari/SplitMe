# SplitMe

[![wercker status](https://app.wercker.com/status/5ad10e66eced6a3bfc139f962105324e/m/master "wercker status")](https://app.wercker.com/project/bykey/5ad10e66eced6a3bfc139f962105324e)

## Install

```sh
npm install -g pouchdb-server
npm install
cd cordova
../node_modules/.bin/cordova prepare
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

### iOS

```sh
brew install graphicsmagick
npm run cordova:icons
npm run cordova:imagemin
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
- iOS

### Staging
- Browser [staging.splitme.net](https://staging.splitme.net)

## Screenshot

### Android

```sh
adb shell screencap -p | perl -pe 's/\x0D\x0A/\x0A/g' > screen.png
```

### iOS

`cmd` + `s`

## Redux

### Action name

Use the [FSA](https://github.com/acdlite/flux-standard-action) standard.

use action name linked to the action triggered by the user. The action name shouldn't be link to the mutation of the store needed.

Exception, the action is used in only one reducer and the mutation is duplicated by other action in this same reducer. Then the action name can be linked to the store mutation

## Release process

### iOS

1. Update the *package.json* version.
1. Build the app
1. You may encounter this error *No matching provisioning profile found*. Ask your team for it. You need the provisioning profile and the associated signin key.
1. Go into Xcode build for the *Generic iOS Device*.
1. *Product* > *Archive*.
1. *Upload to App Store*
1. Make sure you have been invited in the *SplitMe* organization.
1. Make sure you are an *App Manager* with your iTunes Connect account.
