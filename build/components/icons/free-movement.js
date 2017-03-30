"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FreeMovement = function (_React$Component) {
  _inherits(FreeMovement, _React$Component);

  function FreeMovement() {
    _classCallCheck(this, FreeMovement);

    return _possibleConstructorReturn(this, (FreeMovement.__proto__ || Object.getPrototypeOf(FreeMovement)).apply(this, arguments));
  }

  _createClass(FreeMovement, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "svg",
        { viewBox: "0 0 480 480" },
        _react2.default.createElement(
          "g",
          { id: "key" },
          _react2.default.createElement("path", { d: "M294.399,196.875l10.574,10.579c2.627-3.028,4.703-6.688,6.27-10.579H294.399z" }),
          _react2.default.createElement("path", { d: "M310.743,163.658c0,0-5.346-10.467-35.785-44.875c-30.422-34.392-50.438-52.094-50.438-52.094   c-11.734-10.376-30.857-10.299-42.514,0.173c0,0-41.014,36.967-61.703,55.609c-20.688,18.626-51.484,55.873-51.484,55.873   c-9.984,12.08-10.346,32.143-0.799,44.564c0,0,13.281,17.327,50.109,48.594c36.828,31.28,47.08,37.157,47.08,37.157   c13.297,7.559,32.859,5.091,44.094-5.363l-23.5-23.842c-14.592-14.842-14.516-38.891,0.232-53.625l41.781-41.781   c7.158-7.171,16.705-11.123,26.861-11.123c10.158,0,19.719,3.952,26.875,11.123l23.42,23.405   C314.801,196.081,317.506,176.955,310.743,163.658z M160.27,196.5c-20.982,0-37.998-17.012-37.998-38.015   c0-20.981,17.016-37.998,37.998-37.998c20.984,0,38.002,17.017,38.002,37.998C198.272,179.488,181.254,196.5,160.27,196.5z" }),
          _react2.default.createElement("path", { d: "M416.598,359.407L261.397,204.206c-3.689-3.689-9.734-3.689-13.422,0l-6.283,6.247l160.033,158.609v20.223h-17.002   L223.805,228.346l-17.629,17.642c-3.703,3.685-3.703,9.764-0.061,13.482l144.625,146.767c3.654,3.749,10.938,6.796,16.172,6.796   h32.656c5.221,0,10.752-4.107,12.266-9.108l8.721-28.734C422.069,370.206,420.303,363.078,416.598,359.407z" })
        )
      );
    }
  }]);

  return FreeMovement;
}(_react2.default.Component);

exports.default = FreeMovement;