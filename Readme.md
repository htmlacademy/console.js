# console.js [![Build Status](https://travis-ci.org/htmlacademy/console.js.svg?branch=master)](https://travis-ci.org/htmlacademy/console.js)
Chrome-like вывод консоли
Доступны `log`, `dir`, `error`

## Подключение


### Подключение для вывода в контейнер

Необходимо подключить скрипт `https://htmlacademy.github.io/console.js/js/index.js`,
файл стилей `https://htmlacademy.github.io/console.js/css/style.css`,
создать контейнер и передать его в `jsConsoleInit`,
которая вернет инициализированную консоль

```html
<div class="console-container"></div>

<style> @import url('//htmlacademy.github.io/console.js/css/style.css'); </style>
<script src="//htmlacademy.github.io/console.js/js/index.js"></script>

<script>
 var jsConsole = new Console(document.querySelector('.console-container'));
 console.log = jsConsole.log;
 console.log(123);
</script>
```

### Автоподключение

Необходимо подключить скрипт `https://htmlacademy.github.io/console.js/js/index-silent.js`

После выполнения автоматически создастся контейнер, в который будет производиться вывод,
а вывод будет доступен используя `window.console`

```html
<script src="//htmlacademy.github.io/console.js/js/index-silent.js"></script>

<script>
 console.log(123);
</script>
```

## Настройка

If you want to configure console, all you need is
```js
window.jsConsole = new Console(document.querySelector(`.console`), {
  object: {
    expandDepth: 2,
    minFieldsToExpand: 1, // will expand if object has 1 or more enumerable fields
    maxFieldsInHead: 2, // trim preview elements inside head up to 2
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

Where 2nd argument in constructor call is params object

You can specify 3 types of views here: `object`, `function` and `array`.

For example to autoexpand logged object specify:

* `expandDepth` — depth on which fields of this object will be expanded. If not specified — 0 by default.
* `minFieldsToExpand` — min length of enumerable fields in that object to autoexpand. If not specified — 0 by default.
* `exclude` — array of view types that don't need to be expanded inside that root view type.

`maxFieldsInHead` — trim preview elements inside head
