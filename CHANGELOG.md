# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

* `FEAT`: added versioned ArchiMate language profiles with opt-in ArchiMate 4.0 support.
* `CORE`: preserved existing ArchiMate 3.x behavior as the default.
* `CORE`: added ArchiMate 3.x to 4.0 migration warnings for retired and merged concepts.
* `FEAT`: added relationship multiplicity storage and rendering for ArchiMate 4.0.
* `FEAT`: added ArchiMate 4 popup actions for custom source and target relationship multiplicity values.
* `CORE`: aligned the ArchiMate 3 profile with the official 3.1 `ElementTypeEnum`, including `AndJunction` and `OrJunction`.
* `CORE`: aligned the ArchiMate 4 profile with the C260 42-element catalog, preserving domain-specific interfaces.
* `CORE`: added ArchiMate 4 junction relationship type and endpoint-chain guards for popup choices and reconnect validation.
* `CORE`: preserved ArchiMate 4 domain metadata on created shapes while retaining the legacy `layer` compatibility attribute.
* `CORE`: added ArchiMate 4 language customization, viewpoint metadata, and pictogram coverage guards.
* `DOCS`: documented the experimental XML/relationship conformance boundary until official C260/MEFF 4 source data is supplied.

## 0.0.4

* `FEAT`: text properties supported
   * Vertical alignment
   * Horizontal alignment
   * Bold
* `CORE`: all ArchiMate elements from Strategy, Business, Application and Technolgy layers supported
* `CORE`: all ArchiMate relationships supported except Junction

## 0.0.3

Initial release

* `FEAT`: create Note
* `CORE`: ArchiMate elements supported
    * Bussiness layer : Actor, Interface, Function, Process
    * Application layer : Interface, Function, Process
    * Technology layer : Interface, Function, Process
* `CORE`: ArchiMate relationships supported
    * Association
