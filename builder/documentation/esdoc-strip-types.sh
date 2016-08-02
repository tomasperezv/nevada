#!/bin/bash
# Command line util to generate the documentation via ESDoc stripping the types from Flow.
rm -fr strip-types/
babel ./src/javascript -q --no-babelrc --plugins 'transform-flow-strip-types' --out-dir ./strip-types/src
babel ./test -q --no-babelrc --plugins 'transform-flow-strip-types' --out-dir ./strip-types/test
./node_modules/.bin/esdoc -c esdoc.json
