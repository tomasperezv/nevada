# Nevada [![Build Status](https://circleci.com/gh/jobandtalent/nevada.png?style=shield)](https://circleci.com/gh/jobandtalent/nevada) [![npm version](https://badge.fury.io/js/%40jobandtalent%2Fnevada.svg)](https://badge.fury.io/js/%40jobandtalent%2Fnevada)

![npm](https://nodei.co/npm/@jobandtalent/nevada.png?mini=true)

This repository contains Jobandtalent frontend code components (less, javascript and coffeescript).

The core is based on es6 combined with [Facebook Flow](https://github.com/facebook/flow) (for static type capabilities) and [Redux](http://redux.js.org/) as an internal architecture.

### Goals

- Avoid having duplicated code across our different projects.  
- Reuse code and components easily.  

### Unit tests

Run `npm run server` and open the [webpack-dev-server link](http://localhost:8080/webpack-dev-server/js-unit-tests.html)

It supports live-reload, so if you modify a module both javascript, coffeescript or less it will be automatically compiled and the browser will take the changes without needing a page refresh.

You can also run the tests manually `npm test`.

[Code coverage](https://circleci.com/api/v1/project/jobandtalent/nevada/latest/artifacts/0//home/ubuntu/nevada/coverage/index.html)

### Documentation

You can find the extensive documentation in the sandbox or [read it online](https://jobandtalent.github.io/nevada/).

- [Overview](manual/overview.md)  
- [Installation](manual/installation.md)  
- [Usage](manual/usage.md)  
- [Example](manual/example.md)  
- [FAQ](manual/faq.md)  

### License

Apache 2

### Maintainer

[Jobandtalent Frontend Guild](mailto:frontend.team@jobandtalent.com)
