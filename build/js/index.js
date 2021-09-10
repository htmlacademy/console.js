(function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var getElement = function getElement(htmlMarkup) {
    var div = document.createElement("div");
    div.innerHTML = htmlMarkup;
    return div.firstElementChild;
  };
  var checkObjectisPrototype = function checkObjectisPrototype(obj) {
    return obj && Object.prototype.hasOwnProperty.call(obj, "constructor") && typeof obj.constructor === "function" && Object.prototype.hasOwnProperty.call(obj.constructor, "prototype") && typeof obj.constructor.prototype === "object" && obj.constructor.prototype === obj;
  };
  var checkEnumContainsValue = function checkEnumContainsValue(enumerable, value) {
    return !!Object.entries(enumerable).find(function (entry) {
      return entry[1] === value;
    });
  };
  var escapeHTML = function escapeHTML(htmlMarkup) {
    return htmlMarkup.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  };

  var AbstractView = /*#__PURE__*/function () {
    function AbstractView() {
      _classCallCheck(this, AbstractView);
    }
    /**
     * @abstract
     * @return {string}
     */


    _createClass(AbstractView, [{
      key: "template",
      get: function get() {}
      /**
       * @return {HTMLElement}
       */

    }, {
      key: "el",
      get: function get() {
        if (!this._el) {
          this._el = this._render();

          this._bind(this._el);
        }

        return this._el;
      }
      /**
       * Renders element from this.template
       * @private
       * @return {HTMLElement}
       */

    }, {
      key: "_render",
      value: function _render() {
        return getElement(this.template);
      }
      /**
       * Method to work with element after render
       * @protected
       */

    }, {
      key: "_bind",
      value: function _bind() {}
    }]);

    return AbstractView;
  }();

  /**
   * Console modes
   * @enum {string}
   */
  var Mode = {
    LOG: "log",
    DIR: "dir",
    PREVIEW: "preview",
    PROP: "prop",
    ERROR: "error",
    LOG_HTML: "log-html"
  };
  /**
   * Viewtypes
   * @enum {string}
   */

  var ViewType = {
    FUNCTION: "function",
    OBJECT: "object",
    ARRAY: "array",
    PRIMITIVE: "primitive"
  };
  /**
   * Console environment
   * @enum {string}
   */

  var Env = {
    TEST: "test"
  };
  /**
   * Promise state
   * @enum {string}
   */

  var PromiseStatus = {
    resolved: "resolved",
    rejected: "rejected",
    pending: "pending"
  };

  var isNativeFunction = function isNativeFunction(fn) {
    return /{\s*\[native code\]\s*}/g.test(fn);
  };

  var getAllPropertyDescriptors = function getAllPropertyDescriptors(objToGetDescriptors) {
    var descriptors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (objToGetDescriptors === null) {
      return descriptors;
    }

    return Object.assign(getAllPropertyDescriptors(Object.getPrototypeOf(objToGetDescriptors), Object.getOwnPropertyDescriptors(objToGetDescriptors)), descriptors);
  };

  var getFirstProtoContainingObject = function getFirstProtoContainingObject(typeView) {
    if (typeView.parentView && typeView.propKey === "__proto__") {
      return getFirstProtoContainingObject(typeView.parentView);
    }

    return typeView.value;
  };

  var TypeView = /*#__PURE__*/function (_AbstractView) {
    _inherits(TypeView, _AbstractView);

    var _super = _createSuper(TypeView);

    function TypeView(params, cons) {
      var _this;

      _classCallCheck(this, TypeView);

      _this = _super.call(this);

      if (params.parentView) {
        _this._parentView = params.parentView;
        _this.rootView = params.parentView.rootView;
      }
      /** @abstract must be overriden */


      _this._viewTypeParams = void 0;
      _this._console = cons;
      _this._value = params.val;
      _this._mode = params.mode;
      _this._type = params.type;
      _this._propKey = params.propKey;
      _this._currentDepth = typeof params.depth === "number" ? params.depth : 1;
      _this._cache = {};
      return _this;
    }
    /**
     * @abstract
     * @protected
     */


    _createClass(TypeView, [{
      key: "_afterRender",
      value: function _afterRender() {}
    }, {
      key: "_bind",
      value: function _bind() {
        if (!this.viewType) {
          throw new Error("this.viewType must be specified");
        }

        if (!this.rootView) {
          throw new Error("this.rootView must be specified");
        }

        this._headEl = this.el.querySelector(".head");
        this._headContentEl = this.el.querySelector(".head__content");
        this._infoEl = this.el.querySelector(".info");
        this._contentEl = this.el.querySelector(".item__content");

        this._afterRender();
      }
    }, {
      key: "protoConstructorName",
      get: function get() {
        if (!this._cache.protoConstructorName) {
          var proto = Object.getPrototypeOf(this._value);
          this._cache.protoConstructorName = proto && proto.hasOwnProperty("constructor") ? proto.constructor.name : "Object";
        }

        return this._cache.protoConstructorName;
      }
    }, {
      key: "stringTagName",
      get: function get() {
        if (!this._cache.stringTagName) {
          var stringTag = Object.prototype.toString.call(this._value);
          this._cache.stringTagName = stringTag.substring(8, stringTag.length - 1);
        }

        return this._cache.stringTagName;
      },
      set: function set(val) {
        if (!this._cache.stringTagName) {
          this._cache.stringTagName = val;
        }
      }
    }, {
      key: "value",
      get: function get() {
        return this._value;
      }
    }, {
      key: "propKey",
      get: function get() {
        return this._propKey;
      }
    }, {
      key: "parentView",
      get: function get() {
        return this._parentView;
      }
      /**
       * Current state
       * @type {{}}
       * @param {{}} params — object with values which will be assigned throught setters
       */

    }, {
      key: "_state",
      get: function get() {
        if (!this._viewState) {
          this._viewState = {};
          Object.defineProperties(this._viewState, Object.getOwnPropertyDescriptors(this._getStateCommonDescriptors()));
          Object.defineProperties(this._viewState, Object.getOwnPropertyDescriptors(this._getStateDescriptors()));
          Object.seal(this._viewState);
        }

        return this._viewState;
      }
      /**
       * @abstract
       * @return {{}} if not overriden return object without descriptors
       */

    }, {
      key: "_getStateDescriptors",
      value: function _getStateDescriptors() {
        return {};
      }
      /**
       * @return {{}} — object that contains descriptors only
       */

    }, {
      key: "_getStateCommonDescriptors",
      value: function _getStateCommonDescriptors() {
        var self = this;
        return {
          set isShowInfo(bool) {
            if (!self._infoEl) {
              return;
            }

            if (bool && !self._infoEl.textContent) {
              self._infoEl.textContent = self.info;
            }

            self._isShowInfo = self.toggleInfoShowed(bool);
          },

          get isShowInfo() {
            return self._isShowInfo;
          },

          set isHeadContentShowed(bool) {
            self.toggleHeadContentShowed(bool);
          },

          set isOpeningDisabled(bool) {
            if (!bool && self._mode === Mode.PREVIEW) {
              throw new Error("Enabling opening object in preview mode is forbidden");
            }

            if (self._isOpeningDisabled === bool) {
              return;
            }

            self.toggleArrowPointer(!bool);

            self._addOrRemoveHeadClickHandler(!bool);

            self._isOpeningDisabled = bool;
          },

          get isOpeningDisabled() {
            return self._isOpeningDisabled;
          },

          set isBraced(bool) {
            self.toggleHeadContentBraced(bool);
          },

          set isOpened(bool) {
            if (bool === self._isOpened) {
              return;
            }

            self._isOpened = bool;
            self.toggleArrowBottom(bool);
            self._state.isContentShowed = bool;
          },

          get isOpened() {
            return self._isOpened;
          },

          set isContentShowed(bool) {
            if (bool === self._isContentShowed) {
              return;
            }

            self._isContentShowed = self.toggleContentShowed(bool);

            if (self._isContentShowed && self._contentEl.childElementCount === 0) {
              self._contentEl.appendChild(self.createContent(self._value, false).fragment);
            }
          },

          get isContentShowed() {
            return self._isContentShowed;
          },

          set isOversized(bool) {
            self.toggleHeadContentOversized(bool);
          },

          set isItalicEnabled(bool) {
            self._isItalicEnabled = self.toggleItalic(bool);
          },

          get isItalicEnabled() {
            return self._isItalicEnabled;
          }

        };
      }
    }, {
      key: "toggleHeadContentBraced",
      value: function toggleHeadContentBraced(isEnable) {
        return this._headContentEl.classList.toggle("entry-container--braced", isEnable);
      }
    }, {
      key: "toggleHeadContentOversized",
      value: function toggleHeadContentOversized(isEnable) {
        return this._headContentEl.classList.toggle("entry-container--oversize", isEnable);
      }
    }, {
      key: "toggleInfoShowed",
      value: function toggleInfoShowed(isEnable) {
        return !this._infoEl.classList.toggle("hidden", !isEnable);
      }
    }, {
      key: "toggleHeadContentShowed",
      value: function toggleHeadContentShowed(isEnable) {
        return !this._headContentEl.classList.toggle("hidden", !isEnable);
      }
    }, {
      key: "toggleContentShowed",
      value: function toggleContentShowed(isEnable) {
        return !this._contentEl.classList.toggle("hidden", !isEnable);
      }
    }, {
      key: "toggleItalic",
      value: function toggleItalic(isEnable) {
        return this._headEl.classList.toggle("italic", isEnable);
      }
    }, {
      key: "toggleArrowPointer",
      value: function toggleArrowPointer(isEnable) {
        return this._headEl.classList.toggle("item__head--arrow-pointer", isEnable);
      }
    }, {
      key: "toggleArrowBottom",
      value: function toggleArrowBottom(isEnable) {
        return this._headEl.classList.toggle("item__head--arrow-bottom", isEnable);
      }
    }, {
      key: "isOpeningAllowed",
      get: function get() {
        return this._mode !== Mode.PREVIEW && !this._state.isOpeningDisabled && this.isAutoExpandNeeded;
      }
    }, {
      key: "depth",
      get: function get() {
        if (!this._cache.depth) {
          this._cache.depth = this._parentView ? this._parentView.depth + 1 : 1;
        }

        return this._cache.depth;
      }
    }, {
      key: "nextNestingLevel",
      get: function get() {
        return this._currentDepth + 1;
      }
    }, {
      key: "_ownPropertySymbols",
      get: function get() {
        if (!this._cache.ownPropertySymbols) {
          this._cache.ownPropertySymbols = Object.getOwnPropertySymbols(this._value);
        }

        return this._cache.ownPropertySymbols;
      }
    }, {
      key: "_ownPropertyDescriptors",
      get: function get() {
        if (!this._cache.ownPropertyDescriptors) {
          this._cache.ownPropertyDescriptors = Object.getOwnPropertyDescriptors(this._value);
        }

        return this._cache.ownPropertyDescriptors;
      }
    }, {
      key: "_ownPropertyDescriptorsWithGetSet",
      get: function get() {
        if (!this._cache.ownPropertyDescriptorsWithGetSet) {
          var descriptors = {};

          for (var key in this._ownPropertyDescriptors) {
            if (!Object.prototype.hasOwnProperty.call(this._ownPropertyDescriptors, key)) {
              continue;
            }

            var descriptor = this._ownPropertyDescriptors[key];

            if (descriptor.get || descriptor.set) {
              descriptors[key] = descriptor;
            }
          }

          this._cache.ownPropertyDescriptorsWithGetSet = descriptors;
        }

        return this._cache.ownPropertyDescriptorsWithGetSet;
      }
    }, {
      key: "_ownPropertyGetSetLength",
      get: function get() {
        if (!this._cache.ownPropertyDescriptorsWithGetSetLength) {
          var count = 0;

          for (var key in this._ownPropertyDescriptorsWithGetSet) {
            if (!Object.prototype.hasOwnProperty.call(this._ownPropertyDescriptorsWithGetSet, key)) {
              continue;
            }

            var descriptor = this._ownPropertyDescriptors[key];

            if (descriptor.get) {
              count++;
            }

            if (descriptor.set) {
              count++;
            }
          }

          this._cache.ownPropertyDescriptorsWithGetSetLength = count;
        }

        return this._cache.ownPropertyDescriptorsWithGetSetLength;
      }
    }, {
      key: "_allPropertyDescriptors",
      get: function get() {
        if (!this._cache.allPropertyDescriptors) {
          this._cache.allPropertyDescriptors = getAllPropertyDescriptors(Object.getPrototypeOf(this._value), this._ownPropertyDescriptors);
        }

        return this._cache.allPropertyDescriptors;
      }
    }, {
      key: "_allPropertyDescriptorsWithGetters",
      get: function get() {
        if (!this._cache.allPropertyDescriptorsWithGetters) {
          var allPropertyDescriptors = getAllPropertyDescriptors(Object.getPrototypeOf(this._value), this._ownPropertyDescriptors);
          var allPropertyDescriptorsWithGetters = {};

          for (var key in allPropertyDescriptors) {
            if (!Object.prototype.hasOwnProperty.call(allPropertyDescriptors, key)) {
              continue;
            }

            var descriptor = allPropertyDescriptors[key];

            if (descriptor.get) {
              allPropertyDescriptorsWithGetters[key] = descriptor;
            }
          }

          this._cache.allPropertyDescriptorsWithGetters = allPropertyDescriptorsWithGetters;
        }

        return this._cache.allPropertyDescriptorsWithGetters;
      }
    }, {
      key: "_categorizedSortedProperties",
      get: function get() {
        if (!this._cache.categorizedProperties) {
          var ownPropertyDescriptors = this._ownPropertyDescriptors;
          var allPropertyDescriptors = this._allPropertyDescriptors;
          var allPropertyDescriptorsWithGetters = this._allPropertyDescriptorsWithGetters;
          var keys = Object.keys(allPropertyDescriptors);
          var enumerableProperties = []; // Перечисляемые свои и из цепочки прототипов с геттерами

          var notEnumerableProperties = []; // Неперечисляемые свои и из цепочки прототипов с геттерами

          keys.forEach(function (key) {
            var descriptor = allPropertyDescriptors[key];

            if (Object.prototype.hasOwnProperty.call(ownPropertyDescriptors, key) || // cause Object.prototype has hasOwnProperty descriptor
            Object.prototype.hasOwnProperty.call(allPropertyDescriptorsWithGetters, key)) {
              if (descriptor.enumerable) {
                enumerableProperties.push(key);
              } else {
                notEnumerableProperties.push(key);
              }
            }
          });
          this._cache.categorizedProperties = {
            enumerableProperties: enumerableProperties,
            notEnumerableProperties: notEnumerableProperties
          };
        }

        return this._cache.categorizedProperties;
      }
    }, {
      key: "_firstProtoContainingObject",
      get: function get() {
        if (this._cache.firstProtoContainingObject === void 0) {
          if (this._propKey === "__proto__") {
            this._cache.firstProtoContainingObject = getFirstProtoContainingObject(this._parentView);
          } else {
            this._cache.firstProtoContainingObject = null;
          }
        }

        return this._cache.firstProtoContainingObject;
      }
      /**
       * @param {boolean} inHead — is head entries
       * @return {Set}
       */

    }, {
      key: "_getEntriesKeys",
      value: function _getEntriesKeys(inHead) {
        var _this$_categorizedSor = this._categorizedSortedProperties,
            enumerableProperties = _this$_categorizedSor.enumerableProperties,
            notEnumerableProperties = _this$_categorizedSor.notEnumerableProperties;

        if (!inHead) {
          enumerableProperties.sort(TypeView.compareProperties);
          notEnumerableProperties.sort(TypeView.compareProperties);
        }

        var symbols = [];

        if (this._console.params[this.rootView.viewType] && this._viewTypeParams.showSymbols) {
          symbols = this._ownPropertySymbols;
        }

        var keys = new Set(enumerableProperties.concat(notEnumerableProperties).concat(symbols));
        var allPropertyDescriptorsWithGetters = this._allPropertyDescriptorsWithGetters;

        if (inHead) {
          for (var key in allPropertyDescriptorsWithGetters) {
            if (!Object.prototype.hasOwnProperty.call(allPropertyDescriptorsWithGetters, key)) {
              continue;
            }

            var descriptorGetter = allPropertyDescriptorsWithGetters[key].get;

            if (!isNativeFunction(descriptorGetter)) {
              keys["delete"](key);
            }
          }
        }

        var removeProperties = this._viewTypeParams.removeProperties;

        var _iterator = _createForOfIteratorHelper(removeProperties),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var prop = _step.value;
            keys["delete"](prop);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return keys;
      }
      /**
       * Head content entries keys
       * @type {Set}
       */

    }, {
      key: "headContentEntriesKeys",
      get: function get() {
        if (!this._headEntriesKeys) {
          this._headEntriesKeys = this._getEntriesKeys(true);
        }

        return this._headEntriesKeys;
      }
      /**
       * Content entries keys
       * @type {Set}
       */

    }, {
      key: "contentEntriesKeys",
      get: function get() {
        if (!this._entriesKeys) {
          this._entriesKeys = this._getEntriesKeys(false);
        }

        return this._entriesKeys;
      }
      /**
       * Check if autoexpand needed
       * Setter for force
       * @type {boolean}
       */

    }, {
      key: "isAutoExpandNeeded",
      get: function get() {
        if (!this._cache.isAutoExpandNeeded) {
          this._cache.isAutoExpandNeeded = false;
          var rootViewTypeParams = this._console.params[this.rootView.viewType];
          var viewTypeParams = this._viewTypeParams;

          if (this._currentDepth > rootViewTypeParams.expandDepth) {
            return this._cache.isAutoExpandNeeded;
          }

          if (this._parentView) {
            if (!(this._parentView.isAutoExpandNeeded && !rootViewTypeParams.excludeViewTypesFromAutoexpand.includes(this.viewType) && !rootViewTypeParams.excludePropertiesFromAutoexpand.includes(this._propKey))) {
              return this._cache.isAutoExpandNeeded;
            }
          }

          var entriesKeysLength = this.contentEntriesKeys.size;

          if (viewTypeParams.showGetters) {
            entriesKeysLength += this._ownPropertyGetSetLength;
          }

          if (viewTypeParams.maxFieldsToAutoexpand >= entriesKeysLength && entriesKeysLength >= viewTypeParams.minFieldsToAutoexpand) {
            this._cache.isAutoExpandNeeded = true;
          }
        }

        return this._cache.isAutoExpandNeeded;
      },
      set: function set(bool) {
        this._cache.isAutoExpandNeeded = bool;
      }
    }, {
      key: "isChangeHeaderOnExpandNeeded",
      get: function get() {
        var typeParams = this._viewTypeParams;
      }
    }, {
      key: "info",
      get: function get() {
        if (this._value[Symbol.toStringTag]) {
          return this._value[Symbol.toStringTag];
        } else if (this.stringTagName !== "Object") {
          return this.stringTagName;
        } else {
          return this.protoConstructorName;
        }
      }
    }, {
      key: "_headClickHandler",
      value: function _headClickHandler(evt) {
        evt.preventDefault();
        this._state.isOpened = !this._state.isOpened;
      }
    }, {
      key: "_addOrRemoveHeadClickHandler",
      value: function _addOrRemoveHeadClickHandler(bool) {
        if (bool) {
          if (!this._bindedHeadClickHandler) {
            this._bindedHeadClickHandler = this._headClickHandler.bind(this);
          }

          this._headEl.addEventListener("click", this._bindedHeadClickHandler);
        } else if (this._bindedHeadClickHandler) {
          this._headEl.removeEventListener("click", this._bindedHeadClickHandler);
        }
      }
    }, {
      key: "_createGettersEntriesFragment",
      value: function _createGettersEntriesFragment() {
        var fragment = document.createDocumentFragment();
        var mode = Mode.PROP;
        var keys = Object.keys(this._ownPropertyDescriptorsWithGetSet);
        keys.sort(TypeView.compareProperties);

        for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
          var key = _keys[_i];
          var descriptor = this._ownPropertyDescriptorsWithGetSet[key];

          if (descriptor.get !== void 0) {
            var getterEl = this._console.createTypedView(descriptor.get, mode, this.nextNestingLevel, this, key).el;

            TypeView.appendEntryElIntoFragment(this._createEntryEl({
              key: "get ".concat(key),
              el: getterEl,
              mode: mode,
              isGrey: true
            }), fragment);
          }

          if (descriptor.set !== void 0) {
            var setterEl = this._console.createTypedView(descriptor.set, mode, this.nextNestingLevel, this, key).el;

            TypeView.appendEntryElIntoFragment(this._createEntryEl({
              key: "set ".concat(key),
              el: setterEl,
              mode: mode,
              isGrey: true
            }), fragment);
          }
        }

        return fragment;
      }
      /**
       * Create entry element
       * @protected
       * @param {{}} params
       * @param {string} params.key — key, index of array or field name
       * @param {HTMLSpanElement|undefined} params.el — HTML span element to append into container
       * @param {Mode} params.mode — log mode
       * @param {boolean} [params.withoutKey] — create entry without key element
       * @param {function} [params.getViewEl] — function to get element if so wasn't present while calling this method
       * @return {HTMLSpanElement}
       */

    }, {
      key: "_createEntryEl",
      value: function _createEntryEl(_ref) {
        var key = _ref.key,
            el = _ref.el,
            mode = _ref.mode,
            withoutKey = _ref.withoutKey,
            withoutValue = _ref.withoutValue,
            getViewEl = _ref.getViewEl,
            isGrey = _ref.isGrey;
        var entryEl = getElement("<div class=\"entry-container__entry\">".concat(withoutKey ? "" : "<span class=\"entry-container__key ".concat(withoutValue ? "" : "entry-container__key--with-colon", " ").concat(isGrey ? "grey" : "", "\">").concat(escapeHTML(key.toString()), "</span>")).concat(withoutValue ? "" : "<div class=\"entry-container__value-container\"></div>", "</div>"));

        if (withoutValue) {
          return entryEl;
        }

        var valueContEl = entryEl.querySelector(".entry-container__value-container");

        if (el) {
          valueContEl.appendChild(el);
        } else {
          valueContEl.textContent = "(...)";
          valueContEl.classList.add("entry-container__value-container--underscore");

          var insertEl = function insertEl() {
            valueContEl.textContent = "";
            valueContEl.classList.remove("entry-container__value-container--underscore");
            var viewEl;

            try {
              viewEl = getViewEl();
              valueContEl.appendChild(viewEl);
            } catch (err) {
              valueContEl.textContent = "[Exception: ".concat(err.stack, "]");
            }

            valueContEl.removeEventListener("click", insertEl);
          };

          valueContEl.addEventListener("click", insertEl);
        }

        return entryEl;
      }
      /**
       * Create typed entry element
       * @protected
       * @param {{}} params
       * @param {{}} params.obj — object/array/fn
       * @param {string} params.key — key, index of array or field name
       * @param {Mode} params.mode — log mode
       * @param {boolean} [params.withoutKey] — create entry without key element
       * @return {HTMLSpanElement}
       */

    }, {
      key: "_createTypedEntryEl",
      value: function _createTypedEntryEl(_ref2) {
        var _this2 = this;

        var obj = _ref2.obj,
            key = _ref2.key,
            mode = _ref2.mode,
            withoutKey = _ref2.withoutKey,
            notCheckDescriptors = _ref2.notCheckDescriptors,
            _ref2$canReturnNull = _ref2.canReturnNull,
            canReturnNull = _ref2$canReturnNull === void 0 ? false : _ref2$canReturnNull;
        var notEnumerableProperties = this._categorizedSortedProperties.notEnumerableProperties;
        var isGrey = false;

        if (mode !== Mode.PREVIEW && (notEnumerableProperties.indexOf(key) !== -1 || this._ownPropertySymbols.indexOf(key) !== -1 || key === "__proto__")) {
          isGrey = true;
        } // if obj is __proto__ or prototype property and has property descriptor with getter for the key


        var isProtoChainGetterCall = this._propKey === "__proto__" && Object.prototype.hasOwnProperty.call(this._allPropertyDescriptorsWithGetters, key);

        var getViewEl = function getViewEl() {
          var val;

          if (isProtoChainGetterCall) {
            val = _this2._allPropertyDescriptorsWithGetters[key].get.call(_this2._firstProtoContainingObject);
          } else {
            val = key === "__proto__" ? Object.getPrototypeOf(obj) : obj[key];
          }

          return _this2._console.createTypedView(val, mode, _this2.nextNestingLevel, _this2, key).el;
        };

        var el;

        try {
          if (notCheckDescriptors) {
            el = getViewEl();
          } else {
            var descriptorsWithGetters = this._allPropertyDescriptorsWithGetters;
            var descriptorWithGetter = descriptorsWithGetters[key]; // if not __proto__ property invoked

            if (!isProtoChainGetterCall) {
              // if it's not a getter or it's a __proto__
              if (!Object.prototype.hasOwnProperty.call(descriptorsWithGetters, key) || key === "__proto__") {
                el = getViewEl(); // if it's a native getter
              } else if (isNativeFunction(descriptorWithGetter.get)) {
                if (mode === Mode.PREVIEW && canReturnNull && !descriptorWithGetter.enumerable) {
                  return null;
                }

                el = getViewEl();
              }
            }
          }
        } catch (err) {
          // console.log(err);
          if (canReturnNull) {
            return null;
          }
        }

        return this._createEntryEl({
          key: key,
          el: el,
          mode: mode,
          withoutKey: withoutKey,
          getViewEl: getViewEl,
          isGrey: isGrey
        });
      }
      /**
       * @param {HTMLElement|null} entryEl
       * @param {DocumentFragment} fragment
       */

    }], [{
      key: "appendEntryElIntoFragment",
      value: function appendEntryElIntoFragment(entryEl, fragment) {
        if (entryEl !== null) {
          fragment.appendChild(entryEl);
        }
      }
    }, {
      key: "prependEntryElIntoFragment",
      value: function prependEntryElIntoFragment(entryEl, fragment) {
        if (entryEl !== null) {
          fragment.insertBefore(entryEl, fragment.firstElementChild);
        }
      }
    }, {
      key: "compareProperties",
      value: function compareProperties(a, b) {
        if (a === b) {
          return 0;
        }

        var chunk = /^\d+|^\D+/;
        var chunka;
        var chunkb;
        var anum;
        var bnum;
        var diff = 0;

        while (diff === 0) {
          if (!a && b) {
            return -1;
          }

          if (!b && a) {
            return 1;
          }

          chunka = a.match(chunk)[0];
          chunkb = b.match(chunk)[0];
          anum = !isNaN(chunka);
          bnum = !isNaN(chunkb);

          if (anum && !bnum) {
            return -1;
          }

          if (bnum && !anum) {
            return 1;
          }

          if (anum && bnum) {
            diff = chunka - chunkb;

            if (diff === 0 && chunka.length !== chunkb.length) {
              if (!(chunka | 0) && !(chunkb | 0)) {
                return chunka.length - chunkb.length;
              } else {
                return chunkb.length - chunka.length;
              }
            }
          } else if (chunka !== chunkb) {
            return chunka < chunkb ? -1 : 1;
          }

          a = a.substring(chunka.length);
          b = b.substring(chunkb.length);
        }

        return diff;
      }
    }]);

    return TypeView;
  }(AbstractView);

  var ObjectView = /*#__PURE__*/function (_TypeView) {
    _inherits(ObjectView, _TypeView);

    var _super = _createSuper(ObjectView);

    function ObjectView(params, cons) {
      var _this;

      _classCallCheck(this, ObjectView);

      _this = _super.call(this, params, cons);
      _this.viewType = ViewType.OBJECT;
      _this._viewTypeParams = _this._console.params[_this.viewType];

      if (!params.parentView) {
        _this.rootView = _assertThisInitialized(_this);
      }

      return _this;
    }

    _createClass(ObjectView, [{
      key: "template",
      get: function get() {
        return "<div class=\"console__item item item--".concat(this.viewType, "\">  <div class=\"head item__head\">    <span class=\"info head__info hidden\"></span>    <div class=\"head__content entry-container entry-container--head entry-container--").concat(this.viewType, " hidden\">").concat(this.getHeadContent(), "</div>  </div>  <div class=\"item__content entry-container entry-container--").concat(this.viewType, " hidden\"></div></div>");
      }
    }, {
      key: "_afterRender",
      value: function _afterRender() {
        if (this.headContentClassName) {
          this._headContentEl.classList.add(this.headContentClassName);
        }

        this._state.isShowInfo = this.isShowInfo;
        this._state.isBraced = this.isShowBraces;
        this._state.isHeadContentShowed = this.isShowHeadContent;
        this._state.isOpeningDisabled = this.isDisableOpening;
        this._state.isItalicEnabled = this.isEnableItalic;
        this._state.isErrorEnabled = this.isEnableError;
        this._state.isOversized = this.isEnableOversized;
        this._state.isOpened = this.isOpeningAllowed;
      }
    }, {
      key: "_getStateDescriptors",
      value: function _getStateDescriptors() {
        var self = this;
        return {
          set isHeadContentShowed(bool) {
            if (bool && !self._headContentEl.innerHTML) {
              var _self$createContent = self.createContent(self.value, true),
                  fragment = _self$createContent.fragment,
                  isOversized = _self$createContent.isOversized;

              self.isEnableOversized = isOversized;

              self._headContentEl.appendChild(fragment);
            }

            self._isHeadContentShowed = self.toggleHeadContentShowed(bool);
          },

          get isHeadContentShowed() {
            return self._isHeadContentShowed;
          },

          set isErrorEnabled(bool) {
            self._isErrorEnabled = self.toggleError(bool);
          },

          get isErrorEnabled() {
            return self._isErrorEnabled;
          },

          set isOpened(bool) {
            if (bool === self._isOpened) {
              return;
            }

            self._isOpened = bool;
            self.toggleArrowBottom(bool);
            self._state.isContentShowed = bool;
            self._state.isHeadContentShowed = self.isShowHeadContent;
            self._state.isShowInfo = self.isShowInfo;
          },

          get isOpened() {
            return self._isOpened;
          }

        };
      }
    }, {
      key: "isShowInfo",
      get: function get() {
        if (this._mode === Mode.PREVIEW && this.stringTagName === "Object" && this.protoConstructorName === "Object") {
          return false;
        }

        var objectIsInstance = this._console.checkInstanceOf(this._value, "Node") || this._console.checkInstanceOf(this._value, "Error") || this._console.checkInstanceOf(this._value, "Date") || this._console.checkInstanceOf(this._value, "RegExp");

        if (objectIsInstance && !checkObjectisPrototype(this._value)) {
          return false;
        }

        if (this._mode === Mode.DIR) {
          return true;
        }

        if (this._mode !== Mode.PREVIEW && this._state.isOpened) {
          return true;
        }

        return this.stringTagName !== "Object" || this.protoConstructorName !== "Object" || this._propKey === "__proto__";
      }
    }, {
      key: "isShowBraces",
      get: function get() {
        if (this._mode === Mode.DIR) {
          return false;
        }

        if (this._mode === Mode.PREVIEW) {
          return this.stringTagName === "Object" && this.protoConstructorName === "Object";
        }

        var objectIsInstance = this._console.checkInstanceOf(this._value, "Node") || this._console.checkInstanceOf(this._value, "Error") || this._console.checkInstanceOf(this._value, "Date") || this._console.checkInstanceOf(this._value, "RegExp");

        if (objectIsInstance && !checkObjectisPrototype(this._value)) {
          return false;
        }

        return true;
      }
    }, {
      key: "isShowHeadContent",
      get: function get() {
        if (this._mode === Mode.PREVIEW && this.stringTagName === "Object" && this.protoConstructorName === "Object") {
          return true;
        }

        var objectIsInstance = this._console.checkInstanceOf(this._value, "Node") || this._console.checkInstanceOf(this._value, "Error") || this._console.checkInstanceOf(this._value, "Date") || this._console.checkInstanceOf(this._value, "RegExp");

        if (objectIsInstance && !checkObjectisPrototype(this._value)) {
          return true;
        }

        if (this._mode !== Mode.DIR && this._mode !== Mode.PREVIEW) {
          return !(this._propKey === "__proto__" || this._state.isOpened);
        }

        return false;
      }
    }, {
      key: "isDisableOpening",
      get: function get() {
        if (this._mode === Mode.PREVIEW) {
          return true;
        }

        if (this._mode === Mode.DIR || this._mode === Mode.PROP) {
          return false;
        }

        var objectIsInstance = this._console.checkInstanceOf(this._value, "Error") || this._console.checkInstanceOf(this._value, "Date") || this._console.checkInstanceOf(this._value, "RegExp");

        if (objectIsInstance && !checkObjectisPrototype(this._value)) {
          return true;
        }

        return false;
      }
    }, {
      key: "isEnableItalic",
      get: function get() {
        if (this._mode === Mode.LOG || this._mode === Mode.LOG_HTML || this._mode === Mode.ERROR) {
          var objectIsInstance = this._console.checkInstanceOf(this._value, "Node") || this._console.checkInstanceOf(this._value, "Error") || this._console.checkInstanceOf(this._value, "Date");

          if (!objectIsInstance && !checkObjectisPrototype(this._value)) {
            return true;
          }
        }

        return false;
      }
    }, {
      key: "isEnableError",
      get: function get() {
        if (this._mode !== Mode.ERROR) {
          return false;
        }

        var objectIsInstance = this._console.checkInstanceOf(this._value, "Error") || this._console.checkInstanceOf(this._value, "Date");

        return objectIsInstance && !checkObjectisPrototype(this._value);
      }
    }, {
      key: "isEnableOversized",
      get: function get() {
        if (!this._isEnableOversized) {
          this.isEnableOversized = false;
        }

        return this._isEnableOversized;
      },
      set: function set(bool) {
        this._isEnableOversized = bool;
      }
    }, {
      key: "toggleError",
      value: function toggleError(isEnable) {
        return this.el.classList.toggle("error", isEnable);
      }
    }, {
      key: "headContentClassName",
      get: function get() {
        if (this._console.checkInstanceOf(this._value, "RegExp") && this._mode !== Mode.DIR) {
          return "c-regexp";
        }

        return null;
      }
    }, {
      key: "getHeadContent",
      value: function getHeadContent() {
        if (this._mode === Mode.PREVIEW && this.stringTagName === "Object" && this.protoConstructorName === "Object") {
          return "\u2026";
        }

        if (!Object.prototype.hasOwnProperty.call(this._value, "constructor")) {
          if (this._console.checkInstanceOf(this._value, "Node")) {
            if (this._console.checkInstanceOf(this._value, "HTMLElement")) {
              var str = this._value.tagName.toLowerCase();

              if (this._value.id) {
                str += "#".concat(this._value.id);
              }

              if (this._value.classList.length) {
                str += "." + Array.prototype.join.call(this._value.classList, ".");
              }

              return str;
            } else {
              return this._value.nodeName;
            }
          } else if (this._console.checkInstanceOf(this._value, "Error")) {
            var _str = this._value.name;

            if (this._value.message) {
              _str += ": ".concat(this._value.message);
            }

            return _str;
          } else if (this._console.checkInstanceOf(this._value, "Date")) {
            return this._value.toString();
          } else if (this._console.checkInstanceOf(this._value, "RegExp")) {
            return "/".concat(this._value.source, "/").concat(this._value.flags);
          }
        }

        return "";
      }
    }, {
      key: "createContent",
      value: function createContent(obj, inHead) {
        var fragment = document.createDocumentFragment();
        var entriesKeys = inHead ? this.headContentEntriesKeys : this.contentEntriesKeys;
        var mode = inHead ? Mode.PREVIEW : Mode.PROP;
        var maxFieldsInHead = this._console.params[this.viewType].maxFieldsInHead;
        var isOversized = false;
        var addedKeysCounter = 0;

        var _iterator = _createForOfIteratorHelper(entriesKeys),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var key = _step.value;

            if (inHead && addedKeysCounter === maxFieldsInHead) {
              isOversized = true;
              break;
            }

            TypeView.appendEntryElIntoFragment(this._createTypedEntryEl({
              obj: obj,
              key: key,
              mode: mode,
              canReturnNull: inHead
            }), fragment);
            addedKeysCounter++;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (!inHead && this._viewTypeParams.showGetters) {
          fragment.appendChild(this._createGettersEntriesFragment());
        }

        if (!inHead && Object.getPrototypeOf(obj) !== null && !this._viewTypeParams.removeProperties.includes("__proto__")) {
          TypeView.appendEntryElIntoFragment(this._createTypedEntryEl({
            obj: obj,
            key: "__proto__",
            mode: mode,
            notCheckDescriptors: true
          }), fragment);
        }

        return {
          fragment: fragment,
          isOversized: isOversized
        };
      }
    }]);

    return ObjectView;
  }(TypeView);

  var MapEntryView = /*#__PURE__*/function (_TypeView) {
    _inherits(MapEntryView, _TypeView);

    var _super = _createSuper(MapEntryView);

    function MapEntryView(params, cons) {
      var _this;

      _classCallCheck(this, MapEntryView);

      _this = _super.call(this, params, cons);
      _this.viewType = ViewType.OBJECT;

      if (!params.parentView) {
        _this.rootView = _assertThisInitialized(_this);
      }

      _this._pairKey = _this._value[0];
      _this._pairValue = _this._value[1];
      return _this;
    }

    _createClass(MapEntryView, [{
      key: "template",
      get: function get() {
        return "<div class=\"console__item item item--".concat(this.viewType, "\">  <div class=\"head item__head\">    <div class=\"head__content entry-container entry-container--").concat(this.viewType, " map-pair hidden\"><!--\n    --><span class=\"map-pair__key\"></span> => <span class=\"map-pair__value\"></span><!--\n --></div>  </div>  <div class=\"item__content entry-container entry-container--").concat(this.viewType, " hidden\"></div></div>");
      }
    }, {
      key: "_afterRender",
      value: function _afterRender() {
        this._pairKeyEl = this._headContentEl.querySelector(".map-pair__key");
        this._pairValueEl = this._headContentEl.querySelector(".map-pair__value");
        this._state.isBraced = this._mode !== Mode.PREVIEW;
        this._state.isHeadContentShowed = true;
        this._state.isOpeningDisabled = this._mode === Mode.PREVIEW;
        this._state.isOpened = this.isOpeningAllowed;
      }
    }, {
      key: "_getStateDescriptors",
      value: function _getStateDescriptors() {
        var self = this;
        return {
          set isHeadContentShowed(bool) {
            if (bool && !self._pairKeyEl.innerHTML && !self._pairValueEl.innerHTML) {
              var keyEl = self._console.createTypedView(self._pairKey, self._mode, self.nextNestingLevel, self, self._propKey).el;

              var valueEl = self._console.createTypedView(self._pairValue, self._mode, self.nextNestingLevel, self, self._propKey).el;

              self._pairKeyEl.appendChild(keyEl);

              self._pairValueEl.appendChild(valueEl);
            }

            self._isHeadContentShowed = self.toggleHeadContentShowed(bool);
          },

          get isHeadContentShowed() {
            return self._isHeadContentShowed;
          },

          set isErrorEnabled(bool) {
            self._isErrorEnabled = self.toggleError(bool);
          },

          get isErrorEnabled() {
            return self._isErrorEnabled;
          }

        };
      }
    }, {
      key: "createContent",
      value: function createContent() {
        var fragment = document.createDocumentFragment();

        var keyEl = this._console.createTypedView(this._pairKey, this._mode, this.nextNestingLevel, this, this._propKey).el;

        var valueEl = this._console.createTypedView(this._pairValue, this._mode, this.nextNestingLevel, this, this._propKey).el;

        TypeView.appendEntryElIntoFragment(this._createEntryEl({
          key: "key",
          el: keyEl,
          withoutKey: false
        }), fragment);
        TypeView.appendEntryElIntoFragment(this._createEntryEl({
          key: "value",
          el: valueEl,
          withoutKey: false
        }), fragment);
        return {
          fragment: fragment
        };
      }
    }]);

    return MapEntryView;
  }(TypeView);

  var MapSetView = /*#__PURE__*/function (_ObjectView) {
    _inherits(MapSetView, _ObjectView);

    var _super = _createSuper(MapSetView);

    function MapSetView(params, cons) {
      _classCallCheck(this, MapSetView);

      return _super.call(this, params, cons);
    }

    _createClass(MapSetView, [{
      key: "createContent",
      value: function createContent(obj, inHead) {
        var mode = inHead ? Mode.PREVIEW : Mode.PROP;
        var fragment;
        var isOversized = false;
        var maxFieldsInHead = this._console.params[this.viewType].maxFieldsInHead; // entries() for Map, values() for Set

        var entriesIterator = obj[Symbol.iterator]();

        var entriesArr = _toConsumableArray(entriesIterator);

        if (inHead) {
          fragment = document.createDocumentFragment();

          for (var i = 0, l = entriesArr.length; i < l; i++) {
            if (i === maxFieldsInHead) {
              isOversized = true;
              break;
            }

            var entry = entriesArr[i];
            var entryEl = void 0;

            if (this._console.checkInstanceOf(this._value, "Map")) {
              var el = new MapEntryView({
                val: entry,
                mode: mode,
                depth: this.nextNestingLevel,
                parentView: this,
                propKey: this._propKey
              }, this._console).el;
              entryEl = this._createEntryEl({
                key: i,
                el: el,
                withoutKey: true
              });
            }

            if (this._console.checkInstanceOf(this.value, "Set")) {
              entryEl = this._createTypedEntryEl({
                obj: entriesArr,
                key: i,
                mode: mode,
                withoutKey: true,
                notCheckDescriptors: true
              });
            }

            TypeView.appendEntryElIntoFragment(entryEl, fragment);
          }
        } else {
          var contentObj = ObjectView.prototype.createContent.apply(this, [obj, inHead]);
          fragment = contentObj.fragment;
          isOversized = contentObj.isOversized; // Object.setPrototypeOf(entriesArr, null); // TODO удалить поле прото из этого объекта, но сделать так, чтобы показывало Array

          var entriesArrView = this._console.createTypedView(entriesArr, Mode.PROP, this.nextNestingLevel, this, "[[Entries]]");

          entriesArrView.isAutoExpandNeeded = true;
          TypeView.appendEntryElIntoFragment(this._createEntryEl({
            key: "[[Entries]]",
            el: entriesArrView.el,
            withoutKey: false
          }), fragment);
        }

        return {
          fragment: fragment,
          isOversized: isOversized
        };
      }
    }]);

    return MapSetView;
  }(ObjectView);

  var PromiseView = /*#__PURE__*/function (_ObjectView) {
    _inherits(PromiseView, _ObjectView);

    var _super = _createSuper(PromiseView);

    function PromiseView(params, cons) {
      _classCallCheck(this, PromiseView);

      return _super.call(this, params, cons);
    }

    _createClass(PromiseView, [{
      key: "_afterRender",
      value: function _afterRender() {
        var _this = this;

        this.getPromiseStatus().then(function (_ref) {
          var value = _ref.value,
              status = _ref.status;
          _this._promiseValue = value;
          _this._promiseStatus = status;

          ObjectView.prototype._afterRender.call(_this);
        });
      }
    }, {
      key: "getPromiseStatus",
      value: function getPromiseStatus() {
        var obj = {};
        return Promise.race([this.value, obj]).then(function (val) {
          var status;
          var value;

          if (val === obj) {
            status = PromiseStatus.pending;
          } else {
            status = PromiseStatus.resolved;
            value = val;
          }

          return {
            status: status,
            value: value
          };
        })["catch"](function (val) {
          return {
            status: PromiseStatus.rejected,
            value: val
          };
        });
      }
    }, {
      key: "createContent",
      value: function createContent(obj, inHead) {
        var _ObjectView$prototype = ObjectView.prototype.createContent.apply(this, [obj, inHead]),
            fragment = _ObjectView$prototype.fragment,
            isOversized = _ObjectView$prototype.isOversized;

        var mode = inHead ? Mode.PREVIEW : Mode.PROP;

        if (inHead) {
          TypeView.prependEntryElIntoFragment(this._createEntryEl({
            key: "<".concat(this._promiseStatus, ">"),
            el: this._console.createTypedView(this._promiseValue, mode, this.nextNestingLevel, this).el,
            withoutValue: this._promiseStatus === PromiseStatus.pending,
            isGrey: true
          }), fragment);
        } else {
          TypeView.appendEntryElIntoFragment(this._createEntryEl({
            key: "[[PromiseStatus]]",
            el: this._console.createTypedView(this._promiseStatus, mode, this.nextNestingLevel, this).el
          }), fragment);
          TypeView.appendEntryElIntoFragment(this._createEntryEl({
            key: "[[PromiseValue]]",
            el: this._console.createTypedView(this._promiseValue, mode, this.nextNestingLevel, this).el
          }), fragment);
        }

        return {
          fragment: fragment,
          isOversized: isOversized
        };
      }
    }]);

    return PromiseView;
  }(ObjectView);

  var StringNumberView = /*#__PURE__*/function (_ObjectView) {
    _inherits(StringNumberView, _ObjectView);

    var _super = _createSuper(StringNumberView);

    function StringNumberView(params, cons) {
      _classCallCheck(this, StringNumberView);

      return _super.call(this, params, cons);
    }
    /**
     * @override TypeView
     */


    _createClass(StringNumberView, [{
      key: "headContentEntriesKeys",
      get: function get() {
        if (!this._headEntriesKeys) {
          this._headEntriesKeys = this._getEntriesKeys(true);

          if (this.value.length) {
            for (var i = 0; i < this.value.length; i++) {
              this._headEntriesKeys["delete"](i.toString());
            }

            this._headEntriesKeys["delete"]("length");
          }
        }

        return this._headEntriesKeys;
      }
    }, {
      key: "createContent",
      value: function createContent(obj, inHead) {
        var _ObjectView$prototype = ObjectView.prototype.createContent.apply(this, [obj, inHead]),
            fragment = _ObjectView$prototype.fragment,
            isOversized = _ObjectView$prototype.isOversized;

        var insertFn = inHead ? TypeView.prependEntryElIntoFragment : TypeView.appendEntryElIntoFragment;
        var mode = inHead ? Mode.PREVIEW : Mode.PROP;

        if (this._console.checkInstanceOf(obj, "String")) {
          var el = this._console.createTypedView(this._value.toString(), mode, this.nextNestingLevel, this).el;

          insertFn(this._createEntryEl({
            key: "[[PrimitiveValue]]",
            el: el,
            withoutKey: inHead
          }), fragment);
        } else if (this._console.checkInstanceOf(obj, "Number")) {
          var _el = this._console.createTypedView(this._value * 1, mode, this.nextNestingLevel, this).el;

          insertFn(this._createEntryEl({
            key: "[[PrimitiveValue]]",
            el: _el,
            withoutKey: inHead
          }), fragment);
        }

        return {
          fragment: fragment,
          isOversized: isOversized
        };
      }
    }]);

    return StringNumberView;
  }(ObjectView);

  var EMPTY = "empty";
  var MULTIPLY_SIGN = "&times;";

  var ArrayView = /*#__PURE__*/function (_TypeView) {
    _inherits(ArrayView, _TypeView);

    var _super = _createSuper(ArrayView);

    function ArrayView(params, cons) {
      var _this;

      _classCallCheck(this, ArrayView);

      _this = _super.call(this, params, cons);
      _this.viewType = ViewType.ARRAY;
      _this._viewTypeParams = _this._console.params[_this.viewType];

      if (!params.parentView) {
        _this.rootView = _assertThisInitialized(_this);
      }

      return _this;
    }

    _createClass(ArrayView, [{
      key: "template",
      get: function get() {
        return "<div class=\"console__item item item--".concat(this.viewType, "\">  <div class=\"head item__head\">    <span class=\"info head__info hidden\"></span>    <span class=\"length head__length hidden\">").concat(this._value.length, "</span>    <div class=\"head__content entry-container entry-container--head entry-container--").concat(this.viewType, " hidden\"></div>  </div>  <div class=\"item__content entry-container entry-container--").concat(this.viewType, " hidden\"></div></div>");
      }
    }, {
      key: "_afterRender",
      value: function _afterRender() {
        this._lengthEl = this.el.querySelector(".length");
        this._state.isBraced = true;
        this._state.isOpeningDisabled = this._mode === Mode.PREVIEW;

        if ((this._mode === Mode.LOG || this._mode === Mode.LOG_HTML || this._mode === Mode.ERROR) && !this._parentView) {
          this.toggleItalic(true);
        }

        this._state.isOpened = this.isOpeningAllowed;
      }
    }, {
      key: "_getStateDescriptors",
      value: function _getStateDescriptors() {
        var self = this;
        return {
          set isHeadContentShowed(bool) {
            if (bool && self._headContentEl.childElementCount === 0) {
              var _self$createContent = self.createContent(self._value, true),
                  fragment = _self$createContent.fragment,
                  isOversized = _self$createContent.isOversized;

              self._state.isOversized = isOversized;

              self._headContentEl.appendChild(fragment);
            }

            self.toggleHeadContentShowed(bool);
          },

          set isShowLength(bool) {
            self.toggleContentLengthShowed(bool);
          },

          set isOpened(bool) {
            if (bool === self._isOpened) {
              return;
            }

            self._isOpened = bool;
            self.toggleArrowBottom(bool);
            self._state.isContentShowed = bool;
            self._state.isHeadContentShowed = self.isShowHeadContent;
            self._state.isShowLength = self.isShowLength;
            self._state.isShowInfo = self.isShowInfo;
          },

          get isOpened() {
            return self._isOpened;
          }

        };
      }
    }, {
      key: "toggleContentLengthShowed",
      value: function toggleContentLengthShowed(isEnable) {
        return !this._lengthEl.classList.toggle("hidden", !isEnable);
      }
    }, {
      key: "info",
      get: function get() {
        if (this._value[Symbol.toStringTag]) {
          return this._value[Symbol.toStringTag];
        } else if (this.stringTagName !== "Object" && (this.stringTagName !== "Array" || this._value === this._console.params.global.Array.prototype)) {
          return this.stringTagName;
        } else {
          return this.protoConstructorName;
        }
      }
    }, {
      key: "isShowInfo",
      get: function get() {
        return this._state.isOpened || this._mode === Mode.DIR || this._mode === Mode.PREVIEW || this.stringTagName !== "Array" || this.protoConstructorName !== "Array";
      }
    }, {
      key: "isShowHeadContent",
      get: function get() {
        return !(this._state.isOpened || this._mode === Mode.DIR || this._mode === Mode.PREVIEW || this._mode === Mode.PROP && this._propKey === "__proto__");
      }
    }, {
      key: "isShowLength",
      get: function get() {
        return this._state.isOpened || this._mode === Mode.DIR || this._mode === Mode.PREVIEW || this._mode === Mode.PROP && this._propKey === "__proto__" || this._value.length > 1;
      }
    }, {
      key: "createContent",
      value: function createContent(arr, inHead) {
        var entriesKeys = inHead ? this.headContentEntriesKeys : this.contentEntriesKeys;
        var fragment = document.createDocumentFragment();
        entriesKeys["delete"]("length"); // Length property not displayed in head, exception

        var isOversized = false;
        var addedKeysCounter = 0;
        var maxFieldsInHead = this._console.params[this.viewType].maxFieldsInHead;
        var mode = inHead ? Mode.PREVIEW : Mode.PROP;
        var countEntriesWithoutKeys = this._console.params[this.viewType].countEntriesWithoutKeys;

        var isMapEntriesSpecialValue = this._propKey === "[[Entries]]" && this._console.checkInstanceOf(this._parentView.value, "Map");

        var emptyCount = 0;

        for (var i = 0, l = arr.length; i < l; i++) {
          if (inHead && countEntriesWithoutKeys && addedKeysCounter === maxFieldsInHead) {
            isOversized = true;
            break;
          }

          var key = i.toString();
          var hasKey = entriesKeys.has(key);

          if (inHead && !hasKey) {
            emptyCount++;
          }

          if (inHead && emptyCount !== 0 && (hasKey || i === l - 1)) {
            TypeView.appendEntryElIntoFragment(this._createEntryEl({
              key: key,
              el: getElement("<span class=\"grey\">".concat(EMPTY).concat(emptyCount > 1 ? " ".concat(MULTIPLY_SIGN, " ").concat(emptyCount) : "", "</span>")),
              withoutKey: true
            }), fragment);

            if (inHead && countEntriesWithoutKeys) {
              addedKeysCounter++;
            }

            emptyCount = 0;
          }

          if (hasKey) {
            if (isMapEntriesSpecialValue) {
              var pair = arr[i];
              var el = new MapEntryView({
                val: pair,
                mode: mode,
                depth: this.nextNestingLevel,
                parentView: this,
                propKey: this._propKey
              }, this._console).el;
              TypeView.appendEntryElIntoFragment(this._createEntryEl({
                key: key,
                el: el,
                withoutKey: inHead
              }), fragment);
            } else {
              TypeView.appendEntryElIntoFragment(this._createTypedEntryEl({
                obj: arr,
                key: key,
                mode: mode,
                withoutKey: inHead,
                notCheckDescriptors: true
              }), fragment);
            }

            entriesKeys["delete"](key);

            if (inHead && countEntriesWithoutKeys) {
              addedKeysCounter++;
            }
          }
        }

        var _iterator = _createForOfIteratorHelper(entriesKeys),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _key = _step.value;

            if (inHead && addedKeysCounter === maxFieldsInHead) {
              isOversized = true;
              break;
            }

            TypeView.appendEntryElIntoFragment(this._createTypedEntryEl({
              obj: arr,
              key: _key,
              mode: mode,
              canReturnNull: inHead
            }), fragment);
            addedKeysCounter++;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (!inHead && this._viewTypeParams.showGetters) {
          fragment.appendChild(this._createGettersEntriesFragment());
        }

        if (!inHead) {
          if (!this._viewTypeParams.removeProperties.includes("length")) {
            TypeView.appendEntryElIntoFragment(this._createTypedEntryEl({
              obj: arr,
              key: "length",
              mode: mode,
              notCheckDescriptors: true
            }), fragment);
          }

          if (!isMapEntriesSpecialValue && !this._viewTypeParams.removeProperties.includes("__proto__")) {
            TypeView.appendEntryElIntoFragment(this._createTypedEntryEl({
              obj: arr,
              key: "__proto__",
              mode: mode,
              notCheckDescriptors: true
            }), fragment);
          }
        }

        return {
          fragment: fragment,
          isOversized: isOversized
        };
      }
    }]);

    return ArrayView;
  }(TypeView);

  var MAX_PREVIEW_FN_BODY_LENGTH = 43;
  var FnType = {
    PLAIN: "plain",
    ARROW: "arrow",
    CLASS: "class"
  };

  var FunctionView = /*#__PURE__*/function (_TypeView) {
    _inherits(FunctionView, _TypeView);

    var _super = _createSuper(FunctionView);

    function FunctionView(params, cons) {
      var _this;

      _classCallCheck(this, FunctionView);

      _this = _super.call(this, params, cons);
      _this.viewType = ViewType.FUNCTION;
      _this._viewTypeParams = _this._console.params[_this.viewType];

      if (!params.parentView) {
        _this.rootView = _assertThisInitialized(_this);
      }

      if (_this.parentView && _this._mode === Mode.PROP && (_this._console.params[_this.parentView.viewType].showMethodBodyOnly || _this._viewTypeParams.showMethodBodyOnly)) {
        _this._mode = Mode.LOG;
      }

      _this._fnType = FunctionView.checkFnType(_this._value);
      return _this;
    }

    _createClass(FunctionView, [{
      key: "template",
      get: function get() {
        var isShowInfo = this._fnType !== FnType.ARROW || this._mode === Mode.PREVIEW;

        var body = this._getBody();

        this._bodyCanWrap = body.includes("\n");
        this._nowrapOnLog = this._console.params[this.viewType].nowrapOnLog && body.includes("\n");
        return "<div class=\"console__item item item--".concat(this.viewType, " ").concat(this._mode === Mode.ERROR ? "error" : "", "\">  <div class=\"head item__head italic\">    <pre class=\"head__content ").concat(this._bodyCanWrap && this._nowrapOnLog ? "nowrap" : "", " ").concat(this._bodyCanWrap ? "pointer" : "", "\"><span class=\"info info--function ").concat(isShowInfo ? "" : "hidden", "\">").concat(this._getInfo(), "</span>").concat(isShowInfo && body ? " " : "").concat(this._getBody(), "</pre>  </div>  <div class=\"item__content entry-container entry-container--").concat(this.viewType, " hidden\"></div></div>");
      }
    }, {
      key: "_afterRender",
      value: function _afterRender() {
        var _this2 = this;

        this._state.isOpeningDisabled = this.isDisableOpening;
        this._state.isOpened = this.isOpeningAllowed;

        if (this._bodyCanWrap) {
          this._headContentEl.addEventListener("click", function () {
            _this2._headContentEl.classList.toggle("nowrap");
          });
        }
      }
    }, {
      key: "isDisableOpening",
      get: function get() {
        return this._mode !== Mode.DIR && this._mode !== Mode.PROP;
      }
    }, {
      key: "_getInfo",
      value: function _getInfo() {
        var str = "";

        switch (this._fnType) {
          case FnType.CLASS:
            str = "class";
            break;

          case FnType.PLAIN:
          case FnType.ARROW:
            str = "f";
            break;
        }

        return str;
      }
    }, {
      key: "_getBody",
      value: function _getBody() {
        var str = "";

        switch (this._mode) {
          case Mode.PROP:
            str = this._getHeadPropMarkup();
            break;

          case Mode.DIR:
            str = this._getHeadDirMarkup();
            break;

          case Mode.LOG:
          case Mode.LOG_HTML:
          case Mode.ERROR:
            str = this._getHeadLogMarkup();
            break;
        }

        return str;
      }
      /**
       * Head content string for Mode.PROP with body
       * body CAN NOT cointain newlines
       * Collapses body if it's lenght is out of MAX_PREVIEW_FN_BODY_LENGTH
       * @return {string}
       */

    }, {
      key: "_getHeadPropMarkup",
      value: function _getHeadPropMarkup() {
        var bodyLines = this._parseBody();

        var params = this._parseParams();

        var joinedLines = bodyLines.map(function (str) {
          return str.trim();
        }).join(" ");
        var markup = "".concat(this._value.name ? this._value.name : "").concat(this._fnType !== FnType.CLASS ? "(".concat(params.join(", "), ")") : "").concat(this._fnType === FnType.ARROW ? " => " : " ");

        if (this._fnType === FnType.ARROW) {
          markup += "".concat(joinedLines.length <= MAX_PREVIEW_FN_BODY_LENGTH ? joinedLines : "{\u2026}");
        }

        return markup;
      }
      /**
       * Head content string for Mode.DIR
       * body CAN NOT cointain newlines
       * @return {string}
       */

    }, {
      key: "_getHeadDirMarkup",
      value: function _getHeadDirMarkup() {
        var params = this._parseParams();

        var markup = "".concat(this._value.name ? this._value.name : "").concat(this._fnType === FnType.PLAIN ? "(".concat(params.join(", "), ")") : "").concat(this._fnType === FnType.ARROW ? "()" : "");
        return markup;
      }
      /**
       * Head content string for Mode.PROP
       * body CAN cointain newlines
       * @return {string}
       */

    }, {
      key: "_getHeadLogMarkup",
      value: function _getHeadLogMarkup() {
        var bodyLines = this._parseBody();

        var params = this._parseParams();

        return "".concat(this._value.name && this._fnType !== FnType.ARROW ? "".concat(this._value.name, " ") : "").concat(this._fnType !== FnType.CLASS ? "(".concat(params.join(", "), ")") : "").concat(this._fnType === FnType.ARROW ? " => " : " ").concat(bodyLines.join("\n"));
      }
    }, {
      key: "_parseParams",
      value: function _parseParams() {
        var str = this._value.toString();

        var paramsStart = str.indexOf("(");
        var paramsEnd = str.indexOf(")");
        var paramsContent = str.substring(paramsStart + 1, paramsEnd).trim();
        return paramsContent ? paramsContent.split(",").map(function (it) {
          return it.trim();
        }) : [];
      }
    }, {
      key: "_parseBody",
      value: function _parseBody() {
        var str = this._value.toString().trim();

        var bodyContent = [];

        if (this._fnType === FnType.ARROW) {
          var arrowIndex = str.indexOf("=>");
          str = str.substring(arrowIndex + 2);
        }

        if (this._fnType === FnType.PLAIN) {
          var lastParenthesisIndex = str.indexOf(")");
          str = str.substring(lastParenthesisIndex);
        }

        var firstBraceIndex = str.indexOf("{");
        str = str.substring(firstBraceIndex);
        var lines = str.split("\n");
        var firstLine = lines.shift().trim();
        var firstWhitespaceIndexes = lines.filter(function (line) {
          return line.length !== 0;
        }).map(function (line) {
          var ex = /^\s+/.exec(line);

          if (ex && ex[0].hasOwnProperty("length")) {
            return ex[0].length;
          }

          return 0;
        });
        var min = Math.min.apply(Math, _toConsumableArray(firstWhitespaceIndexes));
        bodyContent = lines.map(function (line) {
          return line.slice(min);
        });
        bodyContent.unshift(firstLine);
        return bodyContent;
      }
    }, {
      key: "createContent",
      value: function createContent(fn) {
        var fragment = document.createDocumentFragment();
        var entriesKeys = this.contentEntriesKeys;

        var _iterator = _createForOfIteratorHelper(entriesKeys),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var key = _step.value;
            TypeView.appendEntryElIntoFragment(this._createTypedEntryEl({
              obj: fn,
              key: key,
              mode: Mode.PROP
            }), fragment);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (this._viewTypeParams.showGetters) {
          fragment.appendChild(this._createGettersEntriesFragment());
        }

        if (!this._viewTypeParams.removeProperties.includes("__proto__")) {
          TypeView.appendEntryElIntoFragment(this._createTypedEntryEl({
            obj: fn,
            key: "__proto__",
            mode: Mode.PROP,
            notCheckDescriptors: true
          }), fragment);
        }

        return {
          fragment: fragment
        };
      }
    }], [{
      key: "checkFnType",
      value: function checkFnType(fn) {
        var str = fn.toString();
        var firstParenthesisIndex = str.indexOf("(");
        var classIndex = str.indexOf("class");
        var arrowIndex = str.indexOf("=>");

        if (classIndex !== -1 && (firstParenthesisIndex === -1 || classIndex < firstParenthesisIndex)) {
          return FnType.CLASS;
        } else if (arrowIndex !== -1 && arrowIndex > firstParenthesisIndex) {
          return FnType.ARROW;
        }

        return FnType.PLAIN;
      }
    }]);

    return FunctionView;
  }(TypeView);

  var PrimitiveView = /*#__PURE__*/function (_TypeView) {
    _inherits(PrimitiveView, _TypeView);

    var _super = _createSuper(PrimitiveView);

    function PrimitiveView(params, cons) {
      var _this;

      _classCallCheck(this, PrimitiveView);

      _this = _super.call(this, params, cons);

      if (params.parentView) {
        _this._parentView = params.parentView;
      }

      _this.viewType = ViewType.PRIMITIVE;
      return _this;
    }

    _createClass(PrimitiveView, [{
      key: "template",
      get: function get() {
        var type = this._type;
        var value = this._value;
        var html = "";

        if (type === "string" || type === "symbol") {
          if (type === "symbol") {
            value = value.toString();
          }

          if (this._parentView ? this._parentView.mode !== Mode.LOG_HTML : this._mode !== Mode.LOG_HTML) {
            value = escapeHTML(value);
          }
        }

        switch (type) {
          case "undefined":
          case "null":
          case "boolean":
            html = "<div class=\"console__item item item--primitive c-".concat(type, "\">").concat(value, "</div>");
            break;

          case "number":
            html = "<div class=\"console__item item item--primitive c-".concat(type, "\">").concat(value, "</div>");
            break;

          case "string":
            var str;

            if (this._mode === Mode.PREVIEW && value.length > 100) {
              str = "".concat(value.substr(0, 50), "\u2026").concat(value.substr(-50));
            } else {
              str = value;
            }

            html = "<pre class=\"console__item item item--primitive c-string ".concat(this._parentView ? "c-string--with-parent" : "", " ").concat(this._mode === Mode.PROP || this._mode === Mode.PREVIEW ? "nowrap" : "", " ").concat(this._mode === Mode.PROP ? "pointer" : "", " ").concat(this._mode === Mode.ERROR ? "".concat(this._mode) : "", "\">").concat(str, "</pre>");
            break;

          case "symbol":
            html = "<div class=\"console__item item item--primitive c-symbol\">".concat(value, "</div>");
            break;

          case "object":
            if (value === null) {
              html = "<div class=\"console__item item item--primitive c-null\">".concat(value, "</div>");
              break;
            }

        }

        return html;
      }
    }, {
      key: "_bind",
      value: function _bind() {
        var _this2 = this;

        if (this._mode === Mode.PROP && this._type === "string") {
          this.el.addEventListener("click", function (evt) {
            evt.preventDefault();

            _this2.el.classList.toggle("nowrap");
          });
        }
      }
    }]);

    return PrimitiveView;
  }(TypeView);

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var lodash_mergewith = createCommonjsModule(function (module, exports) {
  /**
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /** Used for built-in method references. */
  var arrayProto = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root['__core-js_shared__'];

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Used to infer the `Object` constructor. */
  var objectCtorString = funcToString.call(Object);

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /** Built-in value references. */
  var Buffer = moduleExports ? root.Buffer : undefined,
      Symbol = root.Symbol,
      Uint8Array = root.Uint8Array,
      allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
      getPrototype = overArg(Object.getPrototypeOf, Object),
      objectCreate = Object.create,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      splice = arrayProto.splice,
      symToStringTag = Symbol ? Symbol.toStringTag : undefined;

  var defineProperty = (function() {
    try {
      var func = getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
      nativeMax = Math.max,
      nativeNow = Date.now;

  /* Built-in method references that are verified to be native. */
  var Map = getNative(root, 'Map'),
      nativeCreate = getNative(Object, 'create');

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  var baseCreate = (function() {
    function object() {}
    return function(proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object;
      object.prototype = undefined;
      return result;
    };
  }());

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  }

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
  }

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    return this;
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map || ListCache),
      'string': new Hash
    };
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new ListCache;
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  }

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value),
        isArg = !isArr && isArguments(value),
        isBuff = !isArr && !isArg && isBuffer(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) &&
          !(skipIndexes && (
             // Safari 9 has enumerable `arguments.length` in strict mode.
             key == 'length' ||
             // Node.js 0.10 has enumerable non-index properties on buffers.
             (isBuff && (key == 'offset' || key == 'parent')) ||
             // PhantomJS 2 has enumerable non-index properties on typed arrays.
             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
             // Skip index properties.
             isIndex(key, length)
          ))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * This function is like `assignValue` except that it doesn't assign
   * `undefined` values.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignMergeValue(object, key, value) {
    if ((value !== undefined && !eq(object[key], value)) ||
        (value === undefined && !(key in object))) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
        (value === undefined && !(key in object))) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && defineProperty) {
      defineProperty(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = createBaseFor();

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike(value) &&
      isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }

  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeysIn(object) {
    if (!isObject(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.merge` without support for multiple sources.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} [customizer] The function to customize merged values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor(source, function(srcValue, key) {
      stack || (stack = new Stack);
      if (isObject(srcValue)) {
        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
      }
      else {
        var newValue = customizer
          ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
          : undefined;

        if (newValue === undefined) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    }, keysIn);
  }

  /**
   * A specialized version of `baseMerge` for arrays and objects which performs
   * deep merges and tracks traversed objects enabling objects with circular
   * references to be merged.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {string} key The key of the value to merge.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} mergeFunc The function to merge values.
   * @param {Function} [customizer] The function to customize assigned values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet(object, key),
        srcValue = safeGet(source, key),
        stacked = stack.get(srcValue);

    if (stacked) {
      assignMergeValue(object, key, stacked);
      return;
    }
    var newValue = customizer
      ? customizer(objValue, srcValue, (key + ''), object, source, stack)
      : undefined;

    var isCommon = newValue === undefined;

    if (isCommon) {
      var isArr = isArray(srcValue),
          isBuff = !isArr && isBuffer(srcValue),
          isTyped = !isArr && !isBuff && isTypedArray(srcValue);

      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray(objValue)) {
          newValue = objValue;
        }
        else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        }
        else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        }
        else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        }
        else {
          newValue = [];
        }
      }
      else if (isPlainObject(srcValue) || isArguments(srcValue)) {
        newValue = objValue;
        if (isArguments(objValue)) {
          newValue = toPlainObject(objValue);
        }
        else if (!isObject(objValue) || isFunction(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      }
      else {
        isCommon = false;
      }
    }
    if (isCommon) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack['delete'](srcValue);
    }
    assignMergeValue(object, key, newValue);
  }

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest(func, start) {
    return setToString(overRest(func, start, identity), func + '');
  }

  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var baseSetToString = !defineProperty ? identity : function(func, string) {
    return defineProperty(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant(string),
      'writable': true
    });
  };

  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

    buffer.copy(result);
    return result;
  }

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
  }

  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];

      var newValue = customizer
        ? customizer(object[key], source[key], key, object, source)
        : undefined;

      if (newValue === undefined) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }

  /**
   * Creates a function like `_.assign`.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1,
          length = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined,
          guard = length > 2 ? sources[2] : undefined;

      customizer = (assigner.length > 3 && typeof customizer == 'function')
        ? (length--, customizer)
        : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    return (typeof object.constructor == 'function' && !isPrototype(object))
      ? baseCreate(getPrototype(object))
      : {};
  }

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)
        ) {
      return eq(object[index], value);
    }
    return false;
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

    return value === proto;
  }

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */
  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }

  /**
   * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function safeGet(object, key) {
    if (key === 'constructor' && typeof object[key] === 'function') {
      return;
    }

    if (key == '__proto__') {
      return;
    }

    return object[key];
  }

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString = shortOut(baseSetToString);

  /**
   * Creates a function that'll short out and invoke `identity` instead
   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
   * milliseconds.
   *
   * @private
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new shortable function.
   */
  function shortOut(func) {
    var count = 0,
        lastCalled = 0;

    return function() {
      var stamp = nativeNow(),
          remaining = HOT_SPAN - (stamp - lastCalled);

      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(undefined, arguments);
    };
  }

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse;

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor &&
      funcToString.call(Ctor) == objectCtorString;
  }

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

  /**
   * Converts `value` to a plain object flattening inherited enumerable string
   * keyed properties of `value` to own properties of the plain object.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Object} Returns the converted plain object.
   * @example
   *
   * function Foo() {
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.assign({ 'a': 1 }, new Foo);
   * // => { 'a': 1, 'b': 2 }
   *
   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
   * // => { 'a': 1, 'b': 2, 'c': 3 }
   */
  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }

  /**
   * This method is like `_.merge` except that it accepts `customizer` which
   * is invoked to produce the merged values of the destination and source
   * properties. If `customizer` returns `undefined`, merging is handled by the
   * method instead. The `customizer` is invoked with six arguments:
   * (objValue, srcValue, key, object, source, stack).
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} sources The source objects.
   * @param {Function} customizer The function to customize assigned values.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function customizer(objValue, srcValue) {
   *   if (_.isArray(objValue)) {
   *     return objValue.concat(srcValue);
   *   }
   * }
   *
   * var object = { 'a': [1], 'b': [2] };
   * var other = { 'a': [3], 'b': [4] };
   *
   * _.mergeWith(object, other, customizer);
   * // => { 'a': [1, 3], 'b': [2, 4] }
   */
  var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
    baseMerge(object, source, srcIndex, customizer);
  });

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */
  function constant(value) {
    return function() {
      return value;
    };
  }

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  module.exports = mergeWith;
  });

  var mergeParams$1 = (function (configs) {
    return lodash_mergewith.apply(void 0, [{}].concat(_toConsumableArray(configs.slice()), [function (objValue, srcValue) {
      if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
      }

      return void 0;
    }]));
  });

  var DEFAULT_MAX_FIELDS_IN_HEAD = 5; // const getSpecifiresRE = () => /%s|%d|%i|%f|%o|%O/g;

  /**
   * Console
   * @class
   */

  var Console = /*#__PURE__*/function () {
    /**
     * Initialize console into container
     * @param {HTMLElement} container — console container
     * @param {{}} config — parameters
     * @param {number} params.minFieldsToAutoexpand — min number of fields in obj to expand
     * @param {number} params.maxFieldsInHead — max number of preview fields inside head
     * @param {number} params.expandDepth — level of depth to expand
     * @param {Env} params.env — environment
     **/
    function Console(container) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Console);

      if (!container) {
        throw new Error("Console is not inited!");
      } else if (!(container instanceof HTMLElement)) {
        throw new TypeError("HTML element must be passed as container");
      }

      this._el = document.createElement("div");

      this._el.classList.add("console");

      container.appendChild(this._el);
      this.addConfig(config);
      this.params.global.TypedArray = Object.getPrototypeOf(Int8Array);
    }

    _createClass(Console, [{
      key: "addConfig",
      value: function addConfig() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (!this._configs) {
          this._configs = [];
        }

        this._configs.push(config);

        var mergedParams = mergeParams$1(this._configs);
        this.params = {
          object: this._parseViewParams(ViewType.OBJECT, mergeParams$1([{}, mergedParams.common, mergedParams.object])),
          array: this._parseViewParams(ViewType.ARRAY, mergeParams$1([{}, mergedParams.common, mergedParams.array])),
          "function": this._parseViewParams(ViewType.FUNCTION, mergeParams$1([{}, mergedParams.common, mergedParams["function"]]))
        };
        Object.assign(this.params, this._parseConsoleParams(mergedParams));
      }
    }, {
      key: "_parseConsoleParams",
      value: function _parseConsoleParams(params) {
        var parsedParams = {};

        if (checkEnumContainsValue(Env, params.env)) {
          parsedParams.env = params.env;
        }

        parsedParams.global = params.global ? params.global : window;
        return parsedParams;
      }
      /**
       * @param {ViewType} viewType
       * @param {{}} params
       * @param {number} params.minFieldsToAutoexpand=0 — min number of fields in obj to expand
       * @param {number} params.maxFieldsToAutoexpand=Number.POSITIVE_INFINITY - max number of fields in obj to expand
       * @param {number} params.maxFieldsInHead=DEFAULT_MAX_FIELDS_IN_HEAD — max number of preview fields inside head
       * @param {number} params.expandDepth=0 — level of depth to expand
       * @param {[string]} params.removeProperties=[] — array of properties those won't show up
       * @param {[string]} params.excludePropertiesFromAutoexpand=[] — array of properties those won't autoexpand
       * @param {[ViewType]} params.excludeViewTypesFromAutoexpand=[] — array of view types those won't autoexpand
       * @param {boolean} params.showGetters=true — show getters in view or not
       * @param {boolean} params.showSymbols=true — show symbols in view or not
       * @param {boolean} params.countEntriesWithoutKeys=false — (applies only to ArrayView) count indexed entries or not
       * @param {boolean} params.nowrapOnLog=false — specifies if functions bodies will be collapsed
       * @return {{}} parsed params
       */

    }, {
      key: "_parseViewParams",
      value: function _parseViewParams(viewType) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        // Set this._expandDepth and this._minFieldsToExpand only if expandDepth provided and > 0
        params.expandDepth = typeof params.expandDepth === "number" && params.expandDepth > 0 ? params.expandDepth : 0;
        params.minFieldsToAutoexpand = typeof params.minFieldsToAutoexpand === "number" && params.minFieldsToAutoexpand > 0 ? params.minFieldsToAutoexpand : 0;
        params.maxFieldsToAutoexpand = typeof params.maxFieldsToAutoexpand === "number" && params.maxFieldsToAutoexpand > 0 ? params.maxFieldsToAutoexpand : Number.POSITIVE_INFINITY;
        params.maxFieldsInHead = typeof params.maxFieldsInHead === "number" && params.maxFieldsInHead > 0 ? params.maxFieldsInHead : DEFAULT_MAX_FIELDS_IN_HEAD;

        if (!Array.isArray(params.removeProperties)) {
          params.removeProperties = [];
        }

        if (!Array.isArray(params.excludePropertiesFromAutoexpand)) {
          params.excludePropertiesFromAutoexpand = [];
        }

        if (!Array.isArray(params.excludeViewTypesFromAutoexpand)) {
          params.excludeViewTypesFromAutoexpand = [];
        } else {
          var availableTypes = [];

          for (var key in ViewType) {
            if (ViewType.hasOwnProperty(key)) {
              var type = ViewType[key];
              availableTypes.push(type);
            }
          }

          if (!params.excludeViewTypesFromAutoexpand.every(function (type) {
            return availableTypes.includes(type);
          })) {
            throw new Error("Provided type to exclude is not in available types");
          }
        }

        params.showGetters = typeof params.showGetters === "boolean" ? params.showGetters : true;
        params.showSymbols = typeof params.showSymbols === "boolean" ? params.showSymbols : true;
        params.countEntriesWithoutKeys = typeof params.countEntriesWithoutKeys === "boolean" ? params.countEntriesWithoutKeys : false;
        params.nowrapOnLog = typeof params.nowrapOnLog === "boolean" ? params.nowrapOnLog : false;
        return params;
      }
      /**
       * This is implementation of https://console.spec.whatwg.org/#logger
       * @param {{}} opts
       * @param {[]} entries
       */

    }, {
      key: "_log",
      value: function _log(opts, entries) {
        if (!entries.length) {
          return;
        } // if (entries.length > 1 && getSpecifiresRE().test(entries[0])) {
        //   this._print(opts, this._format(entries));
        //   return;
        // }


        this._print(opts, entries);
      } // _format(entries) {
      //   let targetStr = entries.shift();
      //
      //   const re = getSpecifiresRE();
      //
      //   let match;
      //   while ((match = re.exec(targetStr)) !== null) {
      //     const substitution = entries.shift();
      //     const specifier = match[0];
      //     let convertedSubstitution;
      //     switch (specifier) {
      //       case `%s`:
      //         convertedSubstitution = substitution;
      //         break;
      //       case `%d`:
      //       case `%i`:
      //         if (typeof substitution === `symbol`) {
      //           convertedSubstitution = Number.NaN;
      //         } else {
      //           convertedSubstitution = Number.parseInt(substitution, 10);
      //         }
      //         break;
      //       case `%f`:
      //         if (typeof substitution === `symbol`) {
      //           convertedSubstitution = Number.NaN;
      //         } else {
      //           convertedSubstitution = Number.parseFloat(substitution);
      //         }
      //         break;
      //       case `%o`:
      //
      //         break;
      //       case `%O`:
      //
      //         break;
      //     }
      //     targetStr = targetStr.replace(specifier, convertedSubstitution);
      //   }
      //   entries.unshift(targetStr);
      //   return entries;
      // }

    }, {
      key: "_print",
      value: function _print(_ref, values) {
        var _this = this;

        var mode = _ref.mode,
            modifier = _ref.modifier,
            onPrint = _ref.onPrint;
        var rowEl = getElement("<div class=\"console__row ".concat(modifier ? "console__row--".concat(modifier) : "", "\"></div>"));
        values.forEach(function (val) {
          rowEl.appendChild(_this.createTypedView(val, mode).el);
        });

        this._el.appendChild(rowEl);

        if (onPrint) {
          onPrint(rowEl);
        }

        this.onAny(rowEl);
      }
    }, {
      key: "_getRowEl",
      value: function _getRowEl(entries, mode, modifier) {
        var _this2 = this;

        var el = getElement("<div class=\"console__row ".concat(modifier ? "console__row--".concat(modifier) : "", "\"></div>"));
        entries.forEach(function (val) {
          el.appendChild(_this2.createTypedView(val, mode).el);
        });
        return el;
      }
      /**
       * Subscribe on any event fired
       * @abstract
       */

    }, {
      key: "onAny",
      value: function onAny() {}
      /**
       * Subscribe on log event fired
       * @abstract
       **/

    }, {
      key: "onLog",
      value: function onLog() {}
      /**
       * Subscribe on logHTML event fired
       * @abstract
       **/

    }, {
      key: "onLogHTML",
      value: function onLogHTML() {}
      /**
       * Subscribe on dir event fired
       * @abstract
       **/

    }, {
      key: "onDir",
      value: function onDir() {}
      /**
       * Subscribe on error event fired
       * @abstract
       **/

    }, {
      key: "onError",
      value: function onError() {}
      /**
       * Equivalent to console.log
       * Push rest of arguments into container
       */

    }, {
      key: "log",
      value: function log() {
        for (var _len = arguments.length, entries = new Array(_len), _key = 0; _key < _len; _key++) {
          entries[_key] = arguments[_key];
        }

        this._log({
          mode: Mode.LOG,
          onPrint: this.onLog
        }, entries);
      }
      /**
       * Equivalent to this.log but marks row as output
       */

    }, {
      key: "logOutput",
      value: function logOutput() {
        for (var _len2 = arguments.length, entries = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          entries[_key2] = arguments[_key2];
        }

        this._log({
          mode: Mode.LOG,
          modifier: "output",
          onPrint: this.onLog
        }, entries);
      }
      /**
       * Equivalent to console.log but special charachters in strings won't be excaped
       * Push rest of arguments into container
       */

    }, {
      key: "logHTML",
      value: function logHTML() {
        for (var _len3 = arguments.length, entries = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          entries[_key3] = arguments[_key3];
        }

        this._log({
          mode: Mode.LOG_HTML,
          onPrint: this.onLogHTML
        }, entries);
      }
      /**
       * Equivalent to console.error
       * Push single value into conainer
       */

    }, {
      key: "error",
      value: function error() {
        for (var _len4 = arguments.length, entries = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          entries[_key4] = arguments[_key4];
        }

        this._log({
          mode: Mode.ERROR,
          modifier: "error",
          onPrint: this.onError
        }, entries);
      }
      /**
       * Equivalent to console.dir
       * Push single value into container
       */

    }, {
      key: "dir",
      value: function dir() {
        if (!arguments.length) {
          return;
        }

        this._print({
          mode: Mode.DIR,
          onPrint: this.onDir
        }, [arguments.length <= 0 ? undefined : arguments[0]]);
      }
      /**
       * Logs user input into container
       * Marks row as input
       * @param {string} markup
       */

    }, {
      key: "prompt",
      value: function prompt(markup) {
        var rowEl = getElement("<div class=\"console__row console__row--input\"><pre class=\"console__item item\"></pre></div>");
        rowEl.querySelector(".console__item").innerHTML = markup;

        this._el.appendChild(rowEl);

        this.onAny(rowEl);
      }
      /**
       * Clean container
       */

    }, {
      key: "clean",
      value: function clean() {
        this._el.innerHTML = "";
      }
    }, {
      key: "checkInstanceOf",
      value: function checkInstanceOf(obj, constructorName) {
        return obj instanceof this.params.global[constructorName];
      }
    }, {
      key: "createTypedView",
      value: function createTypedView(val, mode, depth, parentView, propKey) {
        var params = {
          val: val,
          mode: mode,
          depth: depth,
          parentView: parentView,
          type: _typeof(val),
          propKey: propKey
        };

        switch (params.type) {
          case "function":
            return new FunctionView(params, this);

          case "object":
            if (val !== null) {
              var view;
              var stringTag = Object.prototype.toString.call(val);
              var stringTagName = stringTag.substring(8, stringTag.length - 1);
              var objectIsPrototype = checkObjectisPrototype(val);

              if (stringTagName !== "Object" && (Array.isArray(val) || !objectIsPrototype && (this.checkInstanceOf(val, "HTMLCollection") || this.checkInstanceOf(val, "NodeList") || this.checkInstanceOf(val, "DOMTokenList") || this.checkInstanceOf(val, "TypedArray") || stringTagName === "Arguments"))) {
                view = new ArrayView(params, this);
              } else if (!objectIsPrototype && (this.checkInstanceOf(val, "Map") || this.checkInstanceOf(val, "Set"))) {
                view = new MapSetView(params, this);
              } else if (!objectIsPrototype && val instanceof Promise) {
                view = new PromiseView(params, this);
              } else if (!objectIsPrototype && (this.checkInstanceOf(val, "String") || this.checkInstanceOf(val, "Number"))) {
                view = new StringNumberView(params, this);
              } else {
                view = new ObjectView(params, this);
              } // TODO: отнаследовать от ObjectView вьюху для ArrayBuffer, тк там есть длина (), но она записана не в length,
              // а в byteLength


              view.stringTagName = stringTagName;
              return view;
            } else {
              return new PrimitiveView(params, this);
            }

          default:
            return new PrimitiveView(params, this);
        }
      }
      /**
       * get innerHTML of container
       */

    }, {
      key: "sourceLog",
      get: function get() {
        return this._el.innerHTML;
      }
      /**
       * Extend console
       * @param {{}} consoleObject
       * @return {{}} extended console
       */

    }, {
      key: "extend",
      value: function extend(consoleObject) {
        consoleObject.log = this.log.bind(this);
        consoleObject.logHTML = this.logHTML.bind(this);
        consoleObject.info = this.log.bind(this);
        consoleObject.error = this.error.bind(this);
        consoleObject.warn = this.error.bind(this);
        consoleObject.dir = this.dir.bind(this);
        return consoleObject;
      }
    }]);

    return Console;
  }();

  // import '@babel/polyfill/dist/polyfill';
  window.Console = Console;

}());

//# sourceMappingURL=index.js.map
