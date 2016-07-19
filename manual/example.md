# Example

You can create to different types of components. What is different between them is the Redux State, in simple components you won't work with the state, everything is done under the hood. In more complex components you are in charge of managing the Redux State.

## How to create a simple component

First of all you need to create a new directory under the components directory.

`/src/component/example`

Next thing is create a new file that would be our controller `example-controller.js`, the one in charge of the business logic. Every controller needs an ID, don't forget to add one in your controller's constructor before super is called.

```javascript
/* @flow */
'use strict';

import BaseController from '../../javascript/component/base/base-controller';

class ExampleController extends BaseController {

  constructor(options: Object = {}) {
    options.id = 'Example';
    super(options);
  }
}

export default ExampleController;

```

Probably you'll need a view for your controller. Views are automatically set in controllers having the same name than controllers but ending in "view", in your case `example-view.js`.

```javascript
/* @flow */
'use strict';

import BaseView from '../../javascript/component/base/base-view';

class ExampleView extends BaseView {

  constructor(options: Object) {
    super(options);
  }
}

export default ExampleView;
```

Views are in charge of presentation logic so if you need to get elements from the DOM you will start using `locators`.

Imagine that you need to open a hidden element when someone clicks on a button. You will have to create a new locator adding the id of the button and the type of event you will fire. Also you will have to create an action that will be fired when someone click on the button.

What is important here and you don't have to forget is `the locator name has to be the same as the action name`.

```javascript
/* @flow */
'use strict';

import BaseView from '../../javascript/component/base/base-view';

class ExampleView extends BaseView {
  _element: Object;

  constructor(options: Object) {
    options.locators = {
      open: {
        id: '#open_element',
        event: 'click'
      }
    };
    super(options);

    this._element = this.$(this.locators.open.id);
  }

  open() {
    this._element.show();
  }
}

export default ExampleView;
```

For DOM access you can use the $ property the view has. It internally contains jQuery and will let you modify the DOM, apply effects and so on.
