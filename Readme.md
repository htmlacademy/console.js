# console.js [![Build Status](https://travis-ci.org/htmlacademy/console.js.svg?branch=master)](https://travis-ci.org/htmlacademy/console.js)
Chrome-like in-browser console
Available methods:
 * `log`
 * `info` — equivalent to `log`
 * `dir`
 * `error`
 * `warn` — equivalent to `error`

## Usage


### Manual setting

Connect script `https://htmlacademy.github.io/console.js/js/index.js`,
style file `https://htmlacademy.github.io/console.js/css/style.css` on page,
create new Console instance by passing output container

```html
<head>
  <link rel="stylesheet" href="//htmlacademy.github.io/console.js/css/style.css">
</head>
<body>
  <div class="console-container"></div>
  <script src="//htmlacademy.github.io/console.js/js/index.js"></script>

  <script>
   var jsConsole = new Console(document.querySelector('.console-container'));

   jsConsole.log("Here is console.log!");
   // console.log = jsConsole.log.bind(jsConsole);
   // console.dir = jsConsole.dir.bind(jsConsole);
   // ...
   // or use Console.prototype.extend()
   jsConsole.extend(console);
   console.log(123);
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

## Customize output

If you want to configure console, all you need is
```js
const jsConsole = new Console(document.querySelector(`.console`), {});
```

Where 2nd argument in constructor call is params object

You can specify 3 types of views here: `object`, `function` and `array`.

For example to autoexpand logged object specify:

```js
const jsConsole = new Console(document.querySelector(`.console`), {
  object: {
    expandDepth: 2,
    minFieldsToExpand: 1, // will expand if object has 1 or more enumerable fields
    exclude: [`function`, `array`] // will not expanded inside object
  },
  function: {
    expandDepth: 1 // will expand only itself
  },
  array: {
    expandDepth: 2, // expand 2 levels
    minFieldsToExpand: 4, // if there is 4 enum fields in array
    exclude: [`object`] // objects inside array won't be expanded
  }
});
```

* `expandDepth` — depth on which fields of this object will be expanded. If not specified — 0 by default.
* `minFieldsToExpand` — min length of enumerable fields in that object to autoexpand. If not specified — 0 by default.
* `exclude` — array of view types that don't need to be expanded inside that root view type.

You can also trim preview elements inside head (only available in object yet):
```js
object: {
  `maxFieldsInHead`: 3 // trim preview elements down to 3
}
```
