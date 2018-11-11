# console.js [![Build Status](https://travis-ci.org/htmlacademy/console.js.svg?branch=master)](https://travis-ci.org/htmlacademy/console.js)
Chrome-like in-browser console

Available methods:
 * `log`
 * `info` — same as `log`
 * `dir`
 * `error`
 * `warn` — same as `error`
 * `logHTML` — same as `log`, but strings won't be escaped

## Usage


### Manual setting

Connect script `https://htmlacademy.github.io/console.js/latest/js/index.js`,
style file `https://htmlacademy.github.io/console.js/latest/css/style.css` on page,
create new Console instance by passing output container and optional config

```html
<head>
  <link rel="stylesheet" href="//htmlacademy.github.io/console.js/latest/css/style.css">
</head>
<body>
  <div class="console-container"></div>
  <script src="//htmlacademy.github.io/console.js/latest/js/index.js"></script>

  <script>
    const params = {
      expandDepth: 1,
      common: {
        excludeProperties: [`__proto__`],
        maxFieldsInHead: 5,
        minFieldsToAutoexpand: 5,
        maxFieldsToAutoexpand: 15
      }
    };
    var jsConsole = new Console(document.querySelector('.console-container'), params);

    jsConsole.log("Here is console.log!");

    // console.log = jsConsole.log.bind(jsConsole);
    // console.dir = jsConsole.dir.bind(jsConsole);
    // ...
    // console.log(123);
    // or use Console.prototype.extend()
    // jsConsole.extend(console);
    // console.log(123);
  </script>
</body>
```

### Silent

Connect script `https://htmlacademy.github.io/console.js/latest/js/index-silent.js` on page

Script will automatically create console container and extend native browser `window.console`

```html
<script src="//htmlacademy.github.io/console.js/latest/js/index-silent.js"></script>

<script>
 console.log(123);
</script>
```

## Presets

Use predefined configurations by connecting scripts on page

### Available presets

* [`htmlacademy.github.io/console.js/latest/js/presets/htmlacademy.js`](https://github.com/htmlacademy/console.js/blob/master/js/presets/htmlacademy.js) —
confifures behaviour, but not enabling autoexpand.
All objects will show only up to `5` properties it preview (header).
Configures autoexpand to be triggered only if there're from `5` to `15` properties.
Excludes `__proto__` property from autoexpand.
Functions bodies will be collapsed.

* [`htmlacademy.github.io/console.js/latest/js/presets/autoexpand-all.js`](https://github.com/htmlacademy/console.js/blob/master/js/presets/autoexpand-all.js) —
Enabling autoexpand of all objects by `1` level.

You can use both to enable autoexpanding with defined behaviour.

### Connecting presets on page

```html
<script src="//htmlacademy.github.io/console.js/latest/js/presets/preset-1.js"></script>
<script src="//htmlacademy.github.io/console.js/latest/js/presets/preset-2.js"></script>
<script src="//htmlacademy.github.io/console.js/latest/js/index-silent.js"></script>
```

Lower connected preset script has higher priority than others. Will be [merged](#presets-merge) with
[lodash.mergeWith](https://lodash.com/docs/4.17.10#mergeWith) using concatinating arrays

## Console constructor
```js
const jsConsole = new Console(DOMElement, config);
```

### Parameters

#### `DOMElement` — container to append console DOM element within.

#### `config` — object containing settings
You can specify 3 types of views here: `object`, `function` and `array`.
And `common`, that has lower priority than concrete. Will be [merged](#presets-merge) into concrete one
with [lodash.mergeWith](https://lodash.com/docs/4.17.10#mergeWith) using concatinating arrays

* `expandDepth` — depth on which fields of this root object will be expanded. Default: `0`.
* `maxFieldsInHead` — max length of properties in preview (head). If has more, `...` at the end will be showed. Default: `5`.
* `minFieldsToAutoexpand` — min length of fields in view type to auto expand. Default: `0`.
* `maxFieldsToAutoexpand` — max length respectively. Default: `Positive infinity`.
* `excludeViewTypesFromAutoexpand` — array of view types that don't need to be expanded inside that root view type.
* `showGetters` — specifies if `get` and `set` methods will be showed in expanded object body. Default: `true`.
* `showMethodBodyOnly` — if function is a method of any type of object — shows only body of this function (in opened object).
* `excludePropertiesFromAutoexpand` — properties in view type which wouldn't be auto expanded.
* `removeProperties` — array of properties to remove from view.

Specific properties for `array`:
* `countEntriesWithoutKeys` — useful only if `maxFieldsInHead` given. Specifies if indexed properties should be counted in preview (head). Default: `false`.

Specific properties for `function`:
* `nowrapOnLog` — specifies if functions bodies will be collapsed. Default: `false`.

Example:
```js
{
  object: {
    expandDepth: 2,
    minFieldsToAutoexpand: 1, // will expand if object has 1 or more enumerable fields
    excludeViewTypesFromAutoexpand: [`function`, `array`] // will not expanded inside object,
    showMethodBodyOnly: true // show method's body only (if object was opened)
  },
  function: {
    expandDepth: 1 // will expand only itself (in dir mode only),
    nowrapOnLog: true // On log will collapse function body
  },
  array: {
    expandDepth: 2, // expand 2 levels
    minFieldsToAutoexpand: 4, // if there is 4 enum fields in array
    excludeViewTypesFromAutoexpand: [`object`] // objects inside array won't be expanded
    countEntriesWithoutKeys: true
  },
  common: {
    expandDepth: 1,
    maxFieldsInHead: 6, // object and array will have up to 6 properties in their previews (headers)
    maxFieldsToAutoexpand: 10 // if there's more than 10 properties in obj of any type, it won't be expanded
  }
}
```

## Config merge example

### Common merge

This config:
```js
{
  object: {
    maxFieldsToAutoexpand: 10,
    excludeViewTypesFromAutoexpand: [`object`]
  },
  common: {
    expandDepth: 1
    maxFieldsToAutoexpand: 15,
    excludeViewTypesFromAutoexpand: [`array`]
  }
};
```

will be transformed into this on application start:

```js
{
  object: {
    maxFieldsToAutoexpand: 10,
    expandDepth: 1,
    excludeViewTypesFromAutoexpand: [`object`, `array`]
  }
}
```

### Presets merge

Using [lodash.mergeWith](https://lodash.com/docs/4.17.10#mergeWith) to merge objects
and concat arrays inside them

You have 2 preset files:
```html
<script src="//htmlacademy.github.io/console.js/latest/js/presets/preset-1.js"></script>
<script src="//htmlacademy.github.io/console.js/latest/js/presets/preset-2.js"></script>
<script src="//htmlacademy.github.io/console.js/latest/js/index-silent.js"></script>
```

preset-1.js contains:
```js
{
  object: {
    maxFieldsToAutoexpand: 5,
    excludeViewTypesFromAutoexpand: [`object`]
  },
  common: {
    excludeViewTypesFromAutoexpand: [`function`]
  }
}
```

preset-2.js contains:

```js
{
  object: {
    maxFieldsToAutoexpand: 10
  },
  common: {
    expandDepth: 1
    excludeViewTypesFromAutoexpand: [`array`]
  }
}
```

result will be:

```js
{
  object: {
    maxFieldsToAutoexpand: 10,
    excludeViewTypesFromAutoexpand: [`object`]
  },
  common: {
    expandDepth: 1
    excludeViewTypesFromAutoexpand: [`array`, `function`]
  }
}
```
