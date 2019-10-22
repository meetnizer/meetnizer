# Meetnizer

Access meetnizer.github.io for other informations

[![Build status][build-image]][build-image]
<!--
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![Test Coverage][coveralls-image]][coveralls-url]
-->

## Data Structure

A meeting could have sessions:

`Meeting[1] > Session[0..*]`

On Item must has at least a session related:

`Itens[0..*] > Session[1..*]`

## License

[MIT](LICENSE)

[build-image]: https://travis-ci.org/meetnizer/meetnizer.svg?branch=master
