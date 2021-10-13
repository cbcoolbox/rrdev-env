var config = {
   entry: './App.jsx',
	
   output: {
      path:'./',
      filename: 'pictures.js',
   },
	
   devServer: {
      inline: true,
      port: 8080
   },
	
   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
				
            query: {
               plugins: ['transform-decorators-legacy'],
               presets: ['es2015', 'react', 'stage-1']
            }
         }
      ]
   }
}

module.exports = config;