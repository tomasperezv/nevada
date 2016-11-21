/* @flow */
'use strict';

import BaseView from '../../javascript/component/base/base-view';

// $FlowFixMe
import '!style!css!less!./main.less';

class TooltipView extends BaseView {
  constructor(options: Object) {
    options.locators = { // eslint-disable-line no-param-reassign
      arrow: '.js_tooltip_arrow',
      closeElement: '.js_tooltip_close',
      closeTooltip: document
    };
    super(options);

    this._defaultAtPosition = "bottom left";

    this._allowedPositions = [
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

    this._tooltip = document.querySelector(this.locators.main);

    if (this._tooltip === null) {
      throw new Error("tooltip has not been found");
    }

    this._trigger = document.querySelector(this._controller._options.trigger);

    if (this._trigger === null) {
      throw new Error("tooltip trigger has not been found");
    }

    this._at = this._controller._options.at;

    if (typeof this._at === 'undefined') {
      this._at = this._defaultAtPosition;
    } else {
      if (typeof this._at !== 'string' ||
          !this._allowedPositions.includes(this._at)) {
        throw new Error("'at' position is not allowed. Please set one of the following: " +
          this._allowedPositions.join(", "));
      }
    }

    this._at = this._at.split(' ');
    this._side = this._at[0];

    if (this._side === 'left' || this._side === 'right') {
      this._direction = 'vertical';
    } else {
      this._direction = 'horizontal';
    }

    this._alignment = this._at[1];
    this._gap = this._controller._options.gap || 12;
    this._defaultPosition = 'absolute';
    this._position = this._controller._options.position || this._defaultPosition;
    this._closeElement = this._controller._options.closeElement || false;

    if (!this._closeElement) {
      this._tooltip.querySelector(this.locators.closeElement).remove();
    }

    if (this._position !== this._defaultPosition && this._position !== 'fixed') {
      throw new Error("position value has to be absolute or fixed");
    }

    this._positionate();
  }

  show(): void {
    this._tooltip.style.opacity = "1";
    this._tooltip.style.display = "block";
  }

  close(): void {
    this._tooltip.style.display = "none";
  }

  onClick(event: Object): void {
    var clickedElement = event.target;
    const closeElementClass = this.locators.closeElement.substring(1);

    if (this._tooltip.hasChildNodes(clickedElement) &&
        (clickedElement.className.indexOf(closeElementClass) !== -1 ||
         clickedElement.parentElement.className.indexOf(closeElementClass) !== -1)) {
      this.close();
    }
  }

  _positionate(): void {
    this._appendToBody();
    this._setCSSPosition();
    this._orientateArrow();
    this._positionateArrow();
    this._setVerticalAndHorizontalAtPositions();
    this._offsettingPosition();
  }

  _setCSSPosition(): void {
    if (this._position !== this._defaultPosition) {
      this._tooltip.style.position = this._position;
    }
  }

  _appendToBody(): void {
    if (this._tooltip.parentNode !== document.body) {
      const clonedTooltip = this._tooltip.cloneNode(true);
      this._tooltip.remove();
      this._tooltip = document.body.appendChild(clonedTooltip);
    }
  }

  _orientateArrow(): void {
    const arrowOrientationMap = {
      'top': 'bottom',
      'bottom': 'top',
      'left': 'right',
      'right': 'left'
    }
    const arrowClassList = ['arrow'];

    arrowClassList.push(arrowOrientationMap[this._side]);
    arrowClassList.push(this._alignment);
    const arrowClassName = arrowClassList.join('_');

    if (this._tooltip.className.indexOf(arrowClassName) === -1) {
      this._tooltip.className += ' ' + arrowClassName;
    }
  }

  _positionateArrow(): void {
    const tooltipPosition = this._tooltipPosition();
    const triggerPosition = this._triggerPosition();
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

  _setVerticalAndHorizontalAtPositions(): void {
    const triggerPosition = this._triggerPosition();
    let verticalPosition = null;
    let horizontalPosition = null;

    if (this._direction === 'horizontal') {
      verticalPosition = triggerPosition[this._side];

      if (this._alignment !== 'center') {
        horizontalPosition = triggerPosition[this._alignment];
      } else {
        horizontalPosition = triggerPosition.left + triggerPosition.width/2;
      }
    } else {
      horizontalPosition = triggerPosition[this._side];

      if (this._alignment !== 'center') {
        verticalPosition = triggerPosition[this._alignment];
      } else {
        verticalPosition = triggerPosition.top + triggerPosition.height/2;
      }
    }

    this._positionateTop(verticalPosition);
    this._positionateLeft(horizontalPosition);
  }

  _offsettingPosition(): void {
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

  _calculateGap(): number {
    let gap = this._gap;

    if (this._side === 'top' || this._side === 'left') {
      gap = -gap;
    }

    return gap;
  }

  _positionateTop(top: number): void {
    if (this._tooltip.style.bottom !== '') {
      this._tooltip.style.bottom = null;
    }

    this._tooltip.style.top = this._toPixels(top);
  }

  _positionateLeft(left: number): void {
    if (this._tooltip.style.right !== '') {
      this._tooltip.style.right = null;
    }

    this._tooltip.style.left = this._toPixels(left);
  }

  _toPixels(pixels: number): string {
    return pixels + "px";
  }

  _tooltipPosition(): Object {
    return this._tooltip.getBoundingClientRect();
  }

  _triggerPosition(): Object {
    return this._trigger.getBoundingClientRect();
  }
}

export default TooltipView;
