## SLP-Analytics

### Usage
```bash
$ npm install -g grunt-cli bower nw-gyp
$ cd SLP-Analytics
$ npm install
$ bower install

# rebuild sqlite3 for node-webkit
$ npm install sqlite3
$ cd node_modules/sqlite3
$ nw-gyp rebuild --target=0.8.5 --arch=ia32  # --target is your node-webkit version
$ cp build/Release/node_sqlite3.node lib/node_sqlite3.node

$ cd ../..
$ nw app/    # nw is alias to node-webkit
```

### Build
```bash
$ grunt build
```
