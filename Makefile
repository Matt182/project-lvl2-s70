install:
	npm install

publish:
	npm publish

make lint:
	npm run eslint

make lint:
	npm run test

gendiff:
	npm run babel-node -- src/bin/gendiff.js
