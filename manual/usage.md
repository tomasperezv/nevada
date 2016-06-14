# Usage

## Server

Webpack is alright. But when its best friend Webpack Development Server joins the party, that's when shit gets real. Why?

You will have in place:

- HTTP server
- File watcher so if you modify a module both javascript, coffeescript or less it will be automatically compiled and the browser will take the changes without needing a page refresh
- Flow checker  
  
For all of that just type `npm run server` in your terminal and open `http://localhost:8080/webpack-dev-server/` in your browser.

## Test

You can run the tests manually by running `npm test`.

Additionally you can run them in the browser:

- Initialize the webpack-dev-server `npm run server`
- [Open the tests](http://localhost:8080/webpack-dev-server/js-unit-tests.html)

## Debug

We have implemented support for debugging the tests via [babel-node-debug](https://github.com/CrabDude/babel-node-debug), for that try `npm run debug-tests`.

```
npm install -g babel-node-debug
babel-node-debug node_modules/.bin/mocha
```

## Check

The command `npm run check` will run the coding standards for all the languages,
as well as checking the coding standards. **Use it**.

## build

If you need to generate a new version of framework bundles, just run:

`npm run build`

A new version of every bundle will be generated.

## Doc

If you have changes and you need to update the docs:

`npm run doc`

## Flow

Typed JavaScript code with Flow annotations easily transforms down to regular JavaScript, so it runs anywhere. 

For checking if everything is ok:

`npm run flow`

## Upgrade the framework bundles

Upgrading the framework version should be relied to the `jt-frontend --upgrade-fw [VERSION]` command, it
will take care of all of the process steps: increasing version numbers, building via webpack, updating the `frontend-framework-rails` gem, etc.
