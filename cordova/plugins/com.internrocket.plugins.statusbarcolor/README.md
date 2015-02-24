# Status Bar Color Cordova Plugin For Android Lollipop

## Installation
### Prerequsites
This must be compiled at Android API level 21 or higher which means you'll have to be using cordova-android v3.7.1 or higher.
The latest version of cordova-cli does not use cordova-android 3.7.1, so to manually install run the following:
``` bash
cordova platform remove android
cordova platform add android@3.7.1
```
### config.xml
The plugin supports any string from [android.graphics.Color.parseColor()](http://developer.android.com/reference/android/graphics/Color.html#parseColor(java.lang.String)), but to ensure compatibility with [cordova-plugin-statusbar](https://github.com/apache/cordova-plugin-statusbar) make sure to use a hex string in the format #RRGGBB.

set the preference `StatusBarBackgroundColor` ([also used by cordova-plugin-statusbar](https://github.com/apache/cordova-plugin-statusbar/blob/master/doc/index.md#preferences))
``` xml
<preference name="StatusBarBackgroundColor" value="#BD3138" />
```

## License
[The MIT License (MIT)](http://www.opensource.org/licenses/mit-license.html)

Copyright (c) 2015 internrocket, inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
