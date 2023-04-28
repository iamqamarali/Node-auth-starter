  const path = require('path');

  module.exports = {
      entry: [
        __dirname + '/src/sass/app.scss',
        __dirname + '/src/js/app.js',
        //__dirname + '/src/sass/admin/admin.scss',
          
      ],
      output: {
          path: path.resolve(__dirname, 'public'), 
          filename: 'js/app.min.js',
      },
      module: {
          rules: [
              {
                  test: /\.js$/,
                  exclude: /node_modules/,
                  use: [],
              }, {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                  use: [
                      {
                          loader: 'file-loader',
                          options: { outputPath: 'css/', name: '[name].min.css'}
                      },
                      'sass-loader'
                  ]
              }
          ]
      }
  };