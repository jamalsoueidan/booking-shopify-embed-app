# predeploy.sh

# remove the version hash from our base javascript file for a stable URL
find dist/static/js -name "main.*.js" -exec mv '{}' dist/static/js/main.js \;
cp -R ./dist/static/js/main.js ../extensions/book-appointment-ext/assets/main.js
# cp -R ./dist/static/js/main.*.js.map ../extensions/book-appointment-ext/assets/