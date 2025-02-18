// eslint.config.mjs
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";

export default [
    {
        // Ignore coverage, test files, and build artifacts
        ignores: [
            "**/coverage/**/*",
            "**/lcov-report/**/*",
            "**/*.test.js",
            "**/*.spec.js",
            "**/dist/**",
            "**/build/**",
            "**/node_modules/**"
        ],
        files: ["**/*.{js,jsx,mjs}"],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: { jsx: true }
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                console: true,
                process: true,
                module: true,
                require: true
            }
        },
        plugins: {
            react: reactPlugin
        },
        settings: {
            react: { version: "detect" }
        },
        rules: {
            // Core JavaScript checks
            "no-undef": "error",
            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^(_|error$)", // Ignore _vars and error params
                    varsIgnorePattern:
                        "^(_|temp|current|set[A-Z])", // Ignore _vars, temp vars, and React setters
                    ignoreRestSiblings: true,
                    args: "none" // Don't check function parameters at all
                }
            ],

            // React-specific rules
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",
            "react/prop-types": "off",

            // Common JS best practices
            "no-var": "error",
            "prefer-const": "off", // Turn this off since we use let for potential reassignment
            "no-duplicate-imports": "error"
        }
    },

    // Special config for test files
    {
        files: ["**/*.test.js", "**/*.spec.js"],
        languageOptions: {
            globals: {
                ...globals.jest,
                ...globals.node,
                console: true,
                process: true
            }
        },
        rules: {
            "no-undef": "off",
            "no-unused-vars": "off"
        }
    }
];
