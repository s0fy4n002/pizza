let mix = require('laravel-mix');

// mix.js('resources/js/app.js', 'js')
//    .sass('resources/scss/app.sass', 'css')
//    .setPublicPath('public');

mix.js('resources/js/app.js', 'public/js/app.js').sass('resources/scss/app.scss', 'public/css/app.css');