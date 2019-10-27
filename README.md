<img src="https://github.com/meetnizer/design/blob/master/logomarca.png" width=300>

Access meetnizer.github.io for other informations

[![Build status][build-image]][build-image]
[![Test Coverage][coveralls-image]][coveralls-url]
<!--
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
-->

## Data Structure

A Meeting could have sessions:

`Meeting[1] > Session[0..*]`

A Item must have at least one session:

`Itens[0..*] > Session[1..*]`

## Electron + React

This app use the structure developed in this github <https://github.com/csepulv/electron-with-create-react-app>

and this post <https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/>

To start the application locally **npm run dev**

## License

[MIT](LICENSE)

[build-image]: https://travis-ci.org/meetnizer/meetnizer.svg?branch=master
[coveralls-image]: https://coveralls.io/repos/github/meetnizer/meetnizer/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/meetnizer/meetnizer?branch=master