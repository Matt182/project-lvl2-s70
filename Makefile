install:
	npm install

publish:
	npm publish

make lint:
	npm run eslint

gendiff:
	npm run babel-node -- src/bin/gendiff.js
