# boerdam-gulpfile
And assets folder structure

*To install enter following command*

` bower install -D boerdam-gulpfile `

## Tasks
- `Gulp`
  - Main task
- `gulp scripts`
  - Concat
  - Minify
  - Babel
  - Sourcemaps
  - BrowserSync
- `gulp styles`
  - Scss compilation
  - Minify
  - Autoprefix
  - Import css
  - BrowserSync
- `gulp images`
  - Images and SVG compression
- `Gulp watch`
  - Watches scripts, cshtml, css and images
  - When changed runs corresponding task
  - BrowserSync
- `Gulp clean`
  - Cleans dist folder

## Other features
- `--development` mode
  - For faster development use the development flag. for example: `gulp watch --development` or `gulp --development`
  - Make sure to run `gulp` without the development flag before distributing
  - Doesn't run autoprefixer, minify, etc.
