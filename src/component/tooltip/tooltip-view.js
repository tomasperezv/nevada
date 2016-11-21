/* @flow */
'use strict';

import BaseView from '../../javascript/component/base/base-view';

// $FlowFixMe
import '!style!css!less!./main.less';

class TooltipView extends BaseView {

  /**
   * @param {Object} options
   * @constructor
   */
  constructor(options: Object) {
    options.locators = { // eslint-disable-line no-param-reassign
      arrow: '.js_tooltip_arrow',
      closeElement: '.js_tooltip_close',
      closeTooltip: document
    };
    super(options);

    this._tooltip = document.querySelector(this.locators.main);

    if (this._tooltip === null) {
      throw new Error("tooltip has not been found");
    }

    this._target = document.querySelector(this._controller._options.target);

    if (this._target === null) {
      throw new Error("tooltip target has not been found");
    }

    this._pointedSide = this._getPointedSide(this._controller._options.at);
    this._alignment = this._getAlignment(this._controller._options.at);
    this._direction = this._getDirection();
    this._gap = this._controller._options.gap || 12;
    this._defaultPosition = 'absolute';
    this._position = this._controller._options.position || this._defaultPosition;
    this._showClose = this._controller._options.showClose || false;

    if (!this._showClose) {
      this._tooltip.querySelector(this.locators.closeElement).remove();
    }

    if (this._position !== this._defaultPosition && this._position !== 'fixed') {
      throw new Error("position value has to be absolute or fixed");
    }

    this._positionate();
  }

  /**
   * @method show
   * @public
   */
  show(): void {
    this._tooltip.style.opacity = "1";
    this._tooltip.style.display = "block";
  }

  /**
   * @method close
   * @public
   */
  close(): void {
    this._tooltip.style.display = "none";
  }

  /**
   * @param {Object} event
   * @method onClick
   * @public
   */
  onClick(event: Object): void {
    var clickedElement = event.target;
    const closeElementClass = this.locators.closeElement.substring(1);

    if (this._tooltip.hasChildNodes(clickedElement) &&
        (clickedElement.className.indexOf(closeElementClass) !== -1 ||
         clickedElement.parentElement.className.indexOf(closeElementClass) !== -1)) {
      this.close();
    }
  }

  /**
   * @method _positionate
   * @private
   */
  _positionate(): void {
    this._appendToBody();
    this._setCSSPosition();
    this._orientateArrow();
    this._positionateArrow();
    this._computePosition();
    this._addExtraOffset();
  }

  /**
   * @method _setCSSPosition
   * @private
   */
  _setCSSPosition(): void {
    if (this._position !== this._defaultPosition) {
      this._tooltip.style.position = this._position;
    }
  }

  /**
   * @method _appendToBody
   * @private
   */
  _appendToBody(): void {
    if (this._tooltip.parentNode !== document.body) {
      const clonedTooltip = this._tooltip.cloneNode(true);
      this._tooltip.remove();
      this._tooltip = document.body.appendChild(clonedTooltip);
    }
  }

  /**
   * @method _orientateArrow
   * @private
   */
  _orientateArrow(): void {
    const arrowOrientationMap = {
      'top': 'bottom',
      'bottom': 'top',
      'left': 'right',
      'right': 'left'
    }
    const arrowClassList = ['arrow'];

    arrowClassList.push(arrowOrientationMap[this._pointedSide]);
    arrowClassList.push(this._alignment);
    const arrowClassName = arrowClassList.join('_');

    if (this._tooltip.className.indexOf(arrowClassName) === -1) {
      this._tooltip.className += ' ' + arrowClassName;
    }
  }

  /**
   * @method _positionateArrow
   * @private
   */
  _positionateArrow(): void {
    const tooltipPosition = this._tooltipPosition();
    const triggerPosition = this._targetPosition();
    const arrow = document.querySelector('.js_tooltip_arrow');
    const arrowPosition = arrow.getBoundingClientRect();

    if (this._direction === 'horizontal') {
      const tooltipWidth = tooltipPosition.width;
      const triggerWidth = triggerPosition.width;

      if (tooltipWidth >= triggerWidth) {
        const triggerCenter = triggerPosition.width/2;

        if ((this._alignment === 'left' &&
            triggerCenter > 3/2 * arrowPosition.width) ||
            (this._alignment === 'right' &&
            triggerCenter < tooltipPosition.width - 3/2 * arrowPosition.width)) {
          arrow.style[this._alignment] = this._toPixels(triggerCenter);
          arrow.style.marginLeft = this._toPixels(-arrowPosition.width/2);
        }
      } else {
        arrow.style.left = '50%';
        arrow.style.marginLeft = this._toPixels(-arrowPosition.width/2);
      }
    } else {
      const tooltipHeight = tooltipPosition.height;
      const triggerHeight = triggerPosition.height;

      if (tooltipHeight >= triggerHeight) {
        const triggerCenter = triggerPosition.height/2;

        if ((this._alignment === 'top' &&
            triggerCenter > 3/2 * arrowPosition.height) ||
            (this._alignment === 'bottom' &&
            triggerCenter < tooltipPosition.height - 3/2 * arrowPosition.height)) {
          arrow.style[this._alignment] = this._toPixels(triggerCenter);
          arrow.style.marginTop = this._toPixels(-arrowPosition.height/2);
        }
      } else {
        arrow.style.top = '50%';
        arrow.style.marginTop = this._toPixels(-arrowPosition.height/2);
      }
    }
  }

  /**
   * @method _computePosition
   * @private
   */
  _computePosition(): void {
    const triggerPosition = this._targetPosition();
    let verticalPosition = null;
    let horizontalPosition = null;

    if (this._direction === 'horizontal') {
      verticalPosition = triggerPosition[this._pointedSide];

      if (this._alignment !== 'center') {
        horizontalPosition = triggerPosition[this._alignment];
      } else {
        horizontalPosition = triggerPosition.left + triggerPosition.width/2;
      }
    } else {
      horizontalPosition = triggerPosition[this._pointedSide];

      if (this._alignment !== 'center') {
        verticalPosition = triggerPosition[this._alignment];
      } else {
        verticalPosition = triggerPosition.top + triggerPosition.height/2;
      }
    }

    this._positionateTop(verticalPosition);
    this._positionateLeft(horizontalPosition);
  }

  /**
   * @method _addExtraOffset
   * @private
   */
  _addExtraOffset(): void {
    const tooltipPosition = this._tooltipPosition();
    let verticalPosition = tooltipPosition.top;
    let horizontalPosition = tooltipPosition.left;

    if (this._direction === 'horizontal') {
      verticalPosition += this._calculateGap();

      if (this._alignment === 'center') {
        horizontalPosition -= tooltipPosition.width/2;
      }

      if (this._alignment === 'right') {
        horizontalPosition -= tooltipPosition.width;
      }
    } else {
      horizontalPosition += this._calculateGap();

      if (this._alignment === 'center') {
        verticalPosition -= tooltipPosition.height/2;
      }

      if (this._alignment === 'right') {
        verticalPosition -= tooltipPosition.height;
      }
    }

    this._positionateLeft(horizontalPosition);
    this._positionateTop(verticalPosition);
  }

  /**
   * @method _calculateGap
   * @returns {number}
   * @private
   */
  _calculateGap(): number {
    let gap = this._gap;

    if (this._poinetdSide === 'top' || this._pointedSide === 'left') {
      gap = -gap;
    }

    return gap;
  }

  /**
   * @param {number} top
   * @method _positionateTop
   * @private
   */
  _positionateTop(top: number): void {
    if (this._tooltip.style.bottom !== '') {
      this._tooltip.style.bottom = null;
    }

    this._tooltip.style.top = this._toPixels(top);
  }

  /**
   * @param {number} left
   * @method _positionateLeft
   * @private
   */
  _positionateLeft(left: number): void {
    if (this._tooltip.style.right !== '') {
      this._tooltip.style.right = null;
    }

    this._tooltip.style.left = this._toPixels(left);
  }

  /**
   * @param {number} pixels
   * @method _toPixels
   * @returns {string}
   * @private
   */
  _toPixels(pixels: number): string {
    return `${pixels}px`;
  }

  /**
   * @method _tooltipPosition
   * @returns {Object}
   * @private
   */
  _tooltipPosition(): Object {
    return this._tooltip.getBoundingClientRect();
  }

  /**
   * @method _targetPosition
   * @returns {Object}
   * @private
   */
  _targetPosition(): Object {
    return this._target.getBoundingClientRect();
  }

  /**
   * @method _convertAtValueToArray
   * @param {string} at
   * @returns {Array}
   * @private
   */
  _convertAtValueToArray(at: string): Array<string> {
    const allowedPositions = [
      "top left",
      "top center",
      "top right",
      "left top",
      "left center",
      "left bottom",
      "right top",
      "right center",
      "right bottom",
      "bottom left",
      "bottom center",
      "bottom right"
    ];

    if (typeof at === 'undefined') {
      at = "bottom left";
    } else {
      if (typeof at !== 'string' ||
          !allowedPositions.includes(at)) {
        throw new Error("'at' position is not allowed. Please set one of the following: " +
          allowedPositions.join(", "));
      }
    }

    return at.split(' ');
  }

  /**
   * @method _getPointedSide
   * @param {string} at
   * @returns {string}
   * @private
   */
  _getPointedSide(at: string): string {
    return this._convertAtValueToArray(at)[0];
  }

  /**
   * @method _getAlignment
   * @param {string} at
   * @returns {string}
   * @private
   */
  _getAlignment(at: string): string {
    return this._convertAtValueToArray(at)[1];
  }

  /**
   * @method _getDirection
   * @returns {string}
   * @private
   */
  _getDirection(): string {
    if (this._pointedSide === 'left' || this._pointedSide === 'right') {
      return 'vertical';
    } else {
      return 'horizontal';
    }
  }
}

export default TooltipView;
