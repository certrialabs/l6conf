# l6conf

## Overview

This node.js library introduces a policy for transforming environment variables into a hierarchically structured json and allows you to overwrite configurations by importing multiple config files consequently.

### Overwriting Example
``` js
// FOO=0
config.env().json({ "foo": "1", "bar": "2" }).json({ "bar": "3" });

config.get("foo"); // 1
config.get("bar"); // 3
```

### Nesting Example
``` sh
DATABASE="MySpecialDB"
DATABASE_USERNAME="root"
DATABASE_PASSWORD="test"
```
transforms to:
``` js
config.get('database'); // MySpecialDB
config.get('database.username'); // root
config.get('database.password'); // test
```

#### 

## Documentation

### Installation
``` sh
$ npm i --save l6conf
```

### Load
``` js
let config = require('l6conf');
```

### Set Environment variables
``` js
/*
  process.env.USER = "test"
  process.env.USER_FIRSTNAME = "John"
  process.env.USER_PASSWORD = "so_secret"
*/

// Sets the variables
config.env();

/*
  config.get('user');           // test
  config.get('user.firstname'); // John
  config.get('user.password')   // so_secret
*/
```

### Set JSON variables
``` js
config.json('./path/to/file.json');
```

or

``` js
config.json({ "hello": { "world": "I am json" } });
```

### Set custom variables
``` js
config.set('foo', 'bar');
```

or

``` js
config.json('foo.bar', 'hello world!');
```

### Get values
``` js
config.get('foo'); // bar
config.get('foo.bar'); // hello world
```

### Hierarchy
The values are being overwritten. This means that the last setting we add will replace previous settings.
``` js
config
  .json( { "user": "root", "pass": "secret" })
  .json( { "pass": "not_so_secret" });

config.get('pass'); // not_so_secret
```

### Testing
To test you should install mocha
``` sh
$ npm -g install mocha
```
and then run
``` sh
$ mocha
```
