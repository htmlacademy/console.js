# console.js
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
 var jsConsole = jsConsoleInit(document.querySelector('.console-container'));
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
