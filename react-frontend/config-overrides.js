const { override, addBabelPlugin } = require("customize-cra");

module.exports = override(
    addBabelPlugin([
        "babel-plugin-styled-components",
        {
            displayName: true,
            fileName: true,
            meaninglessFileNames: ["index", "styles"],
            minify: false,
            pure: true,
            transpileTemplateLiterals: false
        }
    ])
);
