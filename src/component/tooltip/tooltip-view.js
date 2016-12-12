/* @flow */
'use strict';

import BaseView from '../../javascript/component/base/base-view';

// $FlowFixMe
import '!style!css!less!./main.less';

class TooltipView extends BaseView {
  _tooltip: Element;
  _target: Element;
  _pointedSide: string;
  _alignment: string;
  _direction: string;
  _gap: number;
  _position: string;
  _showClose: boolean;

  /**
   * @param {Object} options
   * @constructor
   */
  constructor(options: Object) {
    options.locators = { // eslint-disable-line no-param-reassign
      arrow: '.js_tooltip_arrow',
      closeTooltip: '.js_tooltip_close'
    };
    super(options);

    this._tooltip = document.querySelector(this.locators.main);

    if (this._tooltip === null) {
      throw new Error('tooltip has not been found');
    }

    this._target = document.querySelector(this._controller._options.target);

    if (this._target === null) {
      throw new Error('tooltip target has not been found');
    }

    this._pointedSide = this._getPointedSide(this._controller._options.at);
    this._alignment = this._getAlignment(this._controller._options.at);
    this._direction = this._getDirection();
    this._gap = this._controller._options.gap || 12;
    this._position = this._getCSSPosition(this._controller._options.position);
    this._showClose = this._controller._options.showClose || false;

    if (!this._showClose) {
      this._tooltip.querySelector(this.locators.closeTooltip).remove();
    }

    this._top = 0;
    this._left = 0;

    this._positionate();
    this._initEvents();
  }

  /**
   * @method show
   * @public
   */
  show(): void {
    this._tooltip.style.opacity = '1';
    this._tooltip.style.display = 'block';
  }

  /**
   * @method close
   * @public
   */
  close(): void {
    this._tooltip.style.display = 'none';
  }

  /**
   * @method _initEvents
   * @private
   */
  _initEvents(): void {
    const self = this;
    const closeElement = this._tooltip.querySelector(this.locators.closeTooltip);
    if (closeElement !== null) {
      closeElement.addEventListener('click', (event) => {
        const clickedElement = event.target;
        const closeElementClass = self.locators.closeTooltip.substring(1);

        if (clickedElement.className.indexOf(closeElementClass) !== -1 ||
            clickedElement.parentElement.className.indexOf(closeElementClass) !== -1) {
          self.close();
        }
      });
    }
  }

  /**
   * @method _positionate
   * @private
   */
  _positionate(): void {
    this._appendToBody();
    this._tooltip.style.position = this._position;
    this._orientateArrow();
    this._computePosition();
    this._addExtraOffset();
    this._positionateTop(this._top);
    this._positionateLeft(this._left);
    this._positionateArrow();
    this._tooltip.style.display = 'none';
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
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    };
    const arrowClassList = ['arrow'];

    arrowClassList.push(arrowOrientationMap[this._pointedSide]);
    arrowClassList.push(this._alignment);
    const arrowClassName = arrowClassList.join('_');

    if (this._tooltip.className.indexOf(arrowClassName) === -1) {
      this._tooltip.className += ` ${arrowClassName}`;
    }
  }

  /**
   * @method _computePosition
   * @private
   */
  _computePosition(): void {
    const targetPosition = this._targetPosition();
    let top = 0;
    let left = 0;

    const positionOffsetMap = {
      top: targetPosition.top,
      bottom: targetPosition.bottom,
      left: targetPosition.left,
      right: targetPosition.right,
      center: {
        horizontal: targetPosition.left + parseInt(targetPosition.width / 2, 10),
        vertical: targetPosition.top + parseInt(targetPosition.height / 2, 10)
      }
    };

    if (this._direction === 'horizontal') {
      top = positionOffsetMap[this._pointedSide];
      if (this._alignment === 'center') {
        left = positionOffsetMap[this._alignment].horizontal;
      } else {
        left = positionOffsetMap[this._alignment];
      }
    }

    if (this._direction === 'vertical') {
      left = positionOffsetMap[this._pointedSide];
      if (this._alignment === 'center') {
        top = positionOffsetMap[this._alignment].vertical;
      } else {
        top = positionOffsetMap[this._alignment];
      }
    }

    this._top = top;
    this._left = left;
  }

  /**
   * @method _addExtraOffset
   * @private
   */
  _addExtraOffset(): void {
    const tooltipPosition = this._tooltipPosition();

    const extraOffset = {
      horizontal: {
        side: this._calculateGap(),
        alignment: {
          left: 0,
          center: parseInt(tooltipPosition.width / 2, 10) * -1,
          right: tooltipPosition.width * -1
        }
      },
      vertical: {
        side: this._calculateGap(),
        alignment: {
          top: 0,
          center: parseInt(tooltipPosition.height / 2, 10) * -1,
          bottom: tooltipPosition.height * -1
        }
      }
    };

    if (this._direction === 'horizontal') {
      this._top += extraOffset[this._direction].side;
      this._left += extraOffset[this._direction].alignment[this._alignment];
    } else {
      this._left += extraOffset[this._direction].side;
      this._top += extraOffset[this._direction].alignment[this._alignment];
    }
  }

  /**
   * @method _positionateArrow
   * @private
   */
  _positionateArrow(): void {
    const tooltipPosition = this._tooltipPosition();
    const targetPosition = this._targetPosition();
    const arrow = this._tooltip.querySelector(this.locators.arrow);
    const arrowPosition = arrow.getBoundingClientRect();
    const dimensionMap = {
      horizontal: 'width',
      vertical: 'height'
    };
    const dimension = dimensionMap[this._direction];

    let smallerPosition = null;

    if (tooltipPosition[dimension] >= targetPosition[dimension]) {
      smallerPosition = targetPosition;
    } else {
      smallerPosition = tooltipPosition;
    }

    const minPosition = parseInt(3 / 2 * arrowPosition[dimension], 10);
    const centerPosition = parseInt(smallerPosition[dimension] / 2, 10);

    if (this._alignment !== 'center' && centerPosition > minPosition) {
      arrow.style[this._alignment] = this._toPixels(centerPosition);
      arrow.style[`margin-${this._alignment}`] = this._toPixels(parseInt(-arrowPosition[dimension] / 2, 10));
    }
  }

  /**
   * @method _calculateGap
   * @returns {number}
   * @private
   */
  _calculateGap(): number {
    let gap = this._gap;

    if (this._pointedSide === 'top' || this._pointedSide === 'left') {
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
    if (this._tooltip.style.top !== '') {
      this._tooltip.style.top = null;
    }

    this._tooltip.style.top = this._toPixels(top);
  }

  /**
   * @param {number} left
   * @method _positionateLeft
   * @private
   */
  _positionateLeft(left: number): void {
    if (this._tooltip.style.left !== '') {
      this._tooltip.style.left = null;
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
    let atAux = at;

    const allowedPositions = [
      'top left',
      'top center',
      'top right',
      'left top',
      'left center',
      'left bottom',
      'right top',
      'right center',
      'right bottom',
      'bottom left',
      'bottom center',
      'bottom right'
    ];

    if (typeof atAux === 'undefined') {
      atAux = 'bottom left';
    } else {
      if (typeof atAux !== 'string' ||
          !allowedPositions.includes(atAux)) {
        throw new Error('at position is not allowed. Please set one of the following: ' +
          allowedPositions.join(', '));
      }
    }

    return atAux.split(' ');
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
    let position = 'horizontal';

    if (this._pointedSide === 'left' || this._pointedSide === 'right') {
      position = 'vertical';
    }

    return position;
  }

  /**
   * @method _getCSSPosition
   * @returns {string}
   * @private
   */
  _getCSSPosition(position: string): string {
    const defaultCSSPosition = 'absolute';
    const positionCSSValue = position || defaultCSSPosition;

    if (positionCSSValue !== defaultCSSPosition && positionCSSValue !== 'fixed') {
      throw new Error('position value has to be absolute or fixed');
    }

    return positionCSSValue;
  }
}

export default TooltipView;
