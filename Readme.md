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

Connect script `https://htmlacademy.github.io/console.js/js/index.js`,
style file `https://htmlacademy.github.io/console.js/css/style.css` on page,
create new Console instance by passing output container and optional config

```html
<head>
  <link rel="stylesheet" href="//htmlacademy.github.io/console.js/css/style.css">
</head>
<body>
  <div class="console-container"></div>
  <script src="//htmlacademy.github.io/console.js/js/index.js"></script>

  <script>
    const params = {
      expandDepth: 1,
      common: {
        excludeProperties: [`__proto__`],
        maxFieldsInHead: 5,
        minFieldsToExpand: 5,
        maxFieldsToExpand: 15
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

Connect script `https://htmlacademy.github.io/console.js/js/index-silent.js` on page

Script will automatically create console container and extend native browser `window.console`

```html
<script src="//htmlacademy.github.io/console.js/js/index-silent.js"></script>

<script>
 console.log(123);
</script>
```

## Presets

Use predefined configurations by connecting scripts on page

### Available presets

* [`htmlacademy.github.io/console.js/js/presets/htmlacademy.js`](https://github.com/htmlacademy/console.js/blob/master/js/presets/htmlacademy.js) —
confifures behaviour, but not enabling autoexpand. 
All objects will show only up to `5` properties it preview (header).
Configures autoexpand to be triggered only if there're from `5` to `15` properties.
Excludes `__proto__` property from autoexpand.
Functions bodies will be collapsed.

* [`htmlacademy.github.io/console.js/js/presets/autoexpand-all.js`](https://github.com/htmlacademy/console.js/blob/master/js/presets/autoexpand-all.js) —
Enabling autoexpand of all objects by `1` level.

You can use both to enable autoexpanding with defined behaviour.

### Connecting presets on page

```html
<script src="//htmlacademy.github.io/console.js/js/presets/preset-1.js"></script>
<script src="//htmlacademy.github.io/console.js/js/presets/preset-2.js"></script>
<script src="//htmlacademy.github.io/console.js/js/index-silent.js"></script>
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

* `expandDepth` — depth on which fields of this object will be expanded. Default: `0`.
* `maxFieldsInHead` — max length of properties in preview (head). If has more, `...` at the end will be showed. Default: `5`.
* `minFieldsToExpand` — min length of enumerable fields in that object to autoexpand. Default: `0`.
* `maxFieldsToExpand` — max length respectively. Default: `Positive infinity`.
* `exclude` — array of view types that don't need to be expanded inside that root view type.
* `showGetters` — specifies if `get` and `set` functions will be showed in expanded object body. Default: `true`.

Specific properties for `array`:
* `countEntriesWithoutKeys` — usefull only if `maxFieldsInHead` given. Specifies if indexed properties should be counted in preview (head). Default: `false`.

Specific properties for `function`:
* `nowrapOnLog` — specifies if functions bodies will be collapsed. Default: `false`.

Example:
```js
{
  object: {
    expandDepth: 2,
    minFieldsToExpand: 1, // will expand if object has 1 or more enumerable fields
    exclude: [`function`, `array`] // will not expanded inside object
  },
  function: {
    expandDepth: 1 // will expand only itself (in dir mode only),
    nowrapOnLog: true // On log will collapse function body
  },
  array: {
    expandDepth: 2, // expand 2 levels
    minFieldsToExpand: 4, // if there is 4 enum fields in array
    exclude: [`object`] // objects inside array won't be expanded
    countEntriesWithoutKeys: true
  },
  common: {
    expandDepth: 1,
    maxFieldsInHead: 6, // object and array will have up to 6 properties in their previews (headers)
    maxFieldsToExpand: 10 // if there's more than 10 properties in obj of any type, it won't be expanded
  }
}
```

## Config merge example

### Common merge

This config:
```js
{
  object: {
    maxFieldsToExpand: 10,
    exclude: [`object`]
  },
  common: {
    expandDepth: 1
    maxFieldsToExpand: 15,
    exclude: [`array`]
  }
};
```

will be transformed into this on application start:

```js
{
  object: {
    maxFieldsToExpand: 10,
    expandDepth: 1,
    exclude: [`object`, `array`]
  }
}
```

### Presets merge

Using [lodash.mergeWith](https://lodash.com/docs/4.17.10#mergeWith) to merge objects
and concat arrays inside them

You have 2 preset files:
```html
<script src="//htmlacademy.github.io/console.js/js/presets/preset-1.js"></script>
<script src="//htmlacademy.github.io/console.js/js/presets/preset-2.js"></script>
<script src="//htmlacademy.github.io/console.js/js/index-silent.js"></script>
```

preset-1.js contains:
```js
{
  object: {
    maxFieldsToExpand: 5,
    exclude: [`object`]
  },
  common: {
    exclude: [`function`]
  }
}
```

preset-2.js contains:

```js
{
  object: {
    maxFieldsToExpand: 10
  },
  common: {
    expandDepth: 1
    exclude: [`array`]
  }
}
```

result will be:

```js
{
  object: {
    maxFieldsToExpand: 10,
    exclude: [`object`]
  },
  common: {
    expandDepth: 1
    exclude: [`array`, `function`]
  }
}
```
