"use strict";

const fs  = require('fs'),
      _   = require('lodash');

class Config {

  constructor() {
    this.settings={};
  }

  env() {
    Object.keys(process.env).forEach(key => {
      let nested = key.toLowerCase().split('_'),
          settings = _.cloneDeep(this.settings),
          obj = settings;

      if(nested.slice(-1).pop() == '') {
        nested.pop();
      }

      nested.forEach( v => {
        v = v == '' ? '#' : v;
        if (typeof obj[v] === 'undefined') {
          obj[v] = {};
        }
        obj = obj[v];
      });
      obj.value = process.env[key];

      _.merge(this.settings, settings);
    });
    return this;
  }

  json(attr) {
    let json = typeof attr === 'object' ? attr : JSON.parse(fs.readFileSync(`${process.cwd()}/${attr}`, 'utf8')),
        settings = this._parse(json);
    _.merge(this.settings, settings);
    return this;
  }

  get(key) {
    let obj = this.settings;
    key.split('.').forEach( k => obj = obj[k] );
    return obj.value;
  }

  set(key, value) {
    let nested = key.split('.'),
        settings = _.cloneDeep(this.settings),
        obj = settings;

    nested.forEach( k => {
      if(k) {
        if (typeof obj[k] === 'undefined') {
          obj[k] = {};
        }
        obj = obj[k];
      }
    });
    obj.value = value;
    _.merge(this.settings, settings);
    return this;
  }

  dump() {
    console.log(this.settings);
    return this;
  }

  _parse(json) {
    let obj = {};
    if(typeof json === 'object') {
      Object.keys(json).forEach( key => {
        obj[key] = {};
        if( json[key] && typeof json[key] === 'object' ) {
          obj[key] = this._parse(json[key]);
        } else {
          obj[key]['value'] = json[key];
        }
      });
      return obj;
    }
  }

}

module.exports = new Config;
