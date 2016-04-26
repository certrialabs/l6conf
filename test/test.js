"use strict";

const assert  = require('chai').assert,
      config  = require('../lib/l6conf'),
      env     = require('./mocks/env'),
      json1   = require('./mocks/json1.json'),
      json2   = require('./mocks/json2.json');

describe('Environment Variables', () => {

  before( () => {
    process.env = env;
    config.env();
  });

  it('config.get(\'#\') -> _', () => {
    assert.equal(config.get('#'), process.env._);
  });

  it('config.get(\'#.#\') -> __', () => {
    assert.equal(config.get('#.#'), process.env.__);
  });

  it('config.get(\'#.term\') -> _TERM', () => {
    assert.equal(config.get('#.term'), process.env._TERM);
  });

  it('config.get(\'user\') -> USER', () => {
    assert.equal(config.get('user'), process.env.USER);
  });

  it('config.get(\'user.name\') -> USER_NAME', () => {
    assert.equal(config.get('user.name'), process.env.USER_NAME);
  });

  it('config.get(\'db.username\') -> DB_USERNAME', () => {
    assert.equal(config.get('db.username'), process.env.DB_USERNAME);
  });

});

describe('JSON Variables', () => {

  before( () => {
    config.json('./test/mocks/json1.json');
  });

  it('config.get(\'db.username\') -> json1.db.username', () => {
    assert.equal(config.get('db.username'), json1.db.username);
  });

  it('config.get(\'db.password\') -> json1.db.password', () => {
    assert.equal(config.get('db.password'), json1.db.password);
  });

});

describe('Set', () => {

  before( () => {
  });

  it('config.get(\'username\') -> root', () => {
    config.set('username', 'root');
    assert.equal(config.get('username'), 'root');
  });

  it('config.get(\'db.username\') -> root', () => {
    config.set('db.username', 'root');
    assert.equal(config.get('db.username'), 'root');
  });

});

describe('Hierarchy (Overwriting)', () => {

  before( () => {
  });

  it('json1 > json2 :: config.get(\'db.password\') -> json2.db.password', () => {
    config.json('./test/mocks/json1.json').json('./test/mocks/json2.json');
    assert.equal(config.get('db.password'), json2.db.password);
  });

  it('json2 > json1 :: config.get(\'db.password\') -> json1.db.password', () => {
    config.json('./test/mocks/json2.json').json('./test/mocks/json1.json');
    assert.equal(config.get('db.password'), json1.db.password);
  });

  it('json1 > json2 > env :: config.get(\'db.username\') -> DB_USERNAME', () => {
    config.json('./test/mocks/json1.json').json('./test/mocks/json2.json').env();
    assert.equal(config.get('db.username'), process.env.DB_USERNAME);
  });

  it('env > json1 > json2 :: config.get(\'db.username\') -> json1.db.username', () => {
    config.env().json('./test/mocks/json1.json').json('./test/mocks/json2.json');
    assert.equal(config.get('db.username'), json1.db.username);
  });

  it('env > json1 > json2 > set(\'root\') :: config.get(\'db.username\') -> root', () => {
    config.env().json('./test/mocks/json1.json').json('./test/mocks/json2.json').set('db.username','root');
    assert.equal(config.get('db.username'), 'root');
  });

});
