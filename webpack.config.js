const path = require("path"),
      fs = require("fs"),
      HtmlWebpackPlugin = require("html-webpack-plugin"),
      { CleanWebpackPlugin } = require("clean-webpack-plugin"),
      CopyWebpackPlugin = require("copy-webpack-plugin"),
      MiniCssExtractPlugin = require("mini-css-extract-plugin"),
      optimizationCssAssetPlugin = require("optimize-css-assets-webpack-plugin"),
      terserWebpackPlugin = require("terser-webpack-plugin"),

      StylelintPlugin = require("stylelint-webpack-plugin"),
      isDev = process.env.NODE_ENV === "development",
      isProd = !isDev;

const PATHS = {
    src: path.join(__dirname, "src/pug"),
    dist: path.join(__dirname, "dist")
};

// const PAGES_DIR = `${PATHS.src}`,

//       PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith(".pug"))

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    }

    if (isProd) {
        config.minimizer = [
            new optimizationCssAssetPlugin(),
            new terserWebpackPlugin()
        ]
    }

    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

module.exports = {
    context: path.resolve(__dirname, "src"),
    entry: {
        navigation: ["@navigation/navigation.ts"],
        languages: ["@navigation/components/languages.ts"],
        main: ["@mainTS/main.ts"],
        paintings: ["@paintings/paintings.ts"],
        painting: ["@painting/painting.ts"],
        painting_author: ["@painting_author/author.ts"],
        menu: ["@menu/menu.ts"],
        colors: ["@navigation/components/colors.ts"],
        menu_icon: ["@navigation/components/menu_icon.ts"],
        check_page_language: ["@navigation/components/check_page_language.ts"],
        cursor: ["@cursor/ts/cursor.ts"],
        firstLoad: ["@standartTS/checkFirstLoad.ts"],
        title: ["@standartTS/title.ts"],
    },

    output: { 
        filename: './js/[name].bundle.js',    // prepend folder name
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: './js/chunkFilename.[name].bundle.js'    // prepend folder name
 },

    plugins: [

        // HTML plagin
        new HtmlWebpackPlugin({
            filename: "html/index.html",
            template: "./main.pug",
            chunks: ["check_page_language", "main", "navigation", "cursor", "menu", "menu_icon", "languages", "colors", "title"],
            minify: {
                collapseWhitespace: isProd,
            },
        }),

        new HtmlWebpackPlugin({
            filename: "html/paintings.html",
            template: "./paintings/paintings.pug",
            chunks: ["check_page_language",  "paintings", "navigation", "cursor", "menu", "menu_icon", "languages", "colors", "firstLoad", "title"],
            minify: {
                collapseWhitespace: isProd,
            },
        }),

        new HtmlWebpackPlugin({
            filename: "html/painting.html",
            template: "./paintings/painting/painting.pug",
            chunks: ["check_page_language", "languages", "painting", "navigation", "cursor", "menu", "menu_icon", "colors", "firstLoad", "title"],
            minify: {
                collapseWhitespace: isProd,
            },
        }),
        
        new HtmlWebpackPlugin({
            filename: "html/author.html",
            template: "./paintings/painting/author/author.pug",
            chunks: ["check_page_language", "painting_author", "navigation", "cursor", "menu", "menu_icon", "languages", "colors", "firstLoad", "title"],
            minify: {
                collapseWhitespace: isProd,
            },
        }),
        
        // ...PAGES.map(page => new HtmlWebpackPlugin({
        //     template: `${PAGES_DIR}/${page}`,
        //     filename: `./${page.replace(/\.pug/, ".html")}`
        // })),
        
        // CLEAN plagin
        new CleanWebpackPlugin(),

        // // COPY plagin
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/img"),
                    to: path.resolve(__dirname, "dist/img")
                },
            ]
        }),

        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',  // prepend folder name
            chunkFilename: 'css/[name].[id].css',    // prepend folder name
            ignoreOrder: false,
        }),

        // STYLELINT plagin
        new StylelintPlugin(),
    ],

    resolve: {
        alias: {
            "@mainTS": path.resolve(__dirname, "./src/main/ts"),
            "@navigation": path.resolve(__dirname, "./src/navigation/ts"),
            "@cursor": path.resolve(__dirname, "./src/cursor"),
            "@menu": path.resolve(__dirname, "./src/menu/ts"),
            "@paintings": path.resolve(__dirname, "./src/paintings/ts"),
            "@painting": path.resolve(__dirname, "./src/paintings/painting/ts"),
            "@painting_author": path.resolve(__dirname, "./src/paintings/painting/author/ts"),
            "@standartTS": path.resolve(__dirname, "./src/ts")
        }
    },

    optimization: optimization(),

    module: {
        rules: [

            // Loading SCSS/SASS
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            url: false,
                        },
                    },
                    {
                        loader: 'resolve-url-loader',
                        options: {
                            debug: true,
                            root: path.join(__dirname, './src/img/'),
                            includeRoot: true,
                            absolute: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    }
                ],              
            },

            // Loading CSS
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    "css-loader"
                ],
            },

            // Loading BABEL TS
            {
                test: /\.m?ts$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-typescript"],
                        plugins: ["@babel/plugin-proposal-object-rest-spread"]
                    }
                },
                resolve: {
                    extensions: ['.js', '.ts'],
                }
            },

            // Loading PUG
            {
                test: /\.pug$/,
                loader: "pug-loader"
            },
        ]
    }
};