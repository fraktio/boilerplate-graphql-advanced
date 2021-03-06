module.exports = {
  extends: [
    "standard",
    "eslint:recommended",
    "plugin:switch-case/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["switch-case"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    createDefaultProgram: true,
    project: "./tsconfig.json",
  },
  rules: {
    "newline-per-chained-call": ["error", { ignoreChainWithDepth: 3 }],
    "no-process-env": "error",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "no-param-reassign": ["error", { props: true }],
    "switch-case/newline-between-switch-case": [
      "error",
      "always",
      { fallthrough: "never" },
    ],
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: "return" },
    ],
    "no-unreachable": "error",
    "prefer-object-spread": 0,
    "one-var": ["error", "never"],
    "prefer-destructuring": ["error", { object: true, array: true }],
    "no-console": ["error", { allow: ["warn", "error"] }],
    "generator-star-spacing": ["error", { before: false, after: true }],
    "func-style": ["error", "declaration", { allowArrowFunctions: true }],
    "no-nested-ternary": "error",
    "no-use-before-define": 0,
    curly: ["error", "all"],
    "arrow-body-style": ["error", "as-needed"],
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "import/newline-after-import": ["error", { count: 1 }],
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
        },
        groups: [
          ["builtin", "external"],
          "internal",
          "parent",
          ["sibling", "index"],
        ],
        "newlines-between": "always",
      },
    ],
    "max-len": [
      "error",
      {
        code: 999,
        tabWidth: 2,
        comments: 80,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: "^import\\s.+\\sfrom\\s.+;$",
      },
    ],
    "max-depth": ["error", 5],
    complexity: ["error", 20],
    "max-statements": ["error", 24],
    "max-params": ["error", 3],
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true },
    ],
    "no-trailing-spaces": "error",
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "comma-dangle": ["error", "always-multiline"],
    "space-before-function-paren": [
      "error",
      { anonymous: "always", named: "never", asyncArrow: "always" },
    ],
    "array-bracket-newline": ["error", "consistent"],
    "no-else-return": ["error", { allowElseIf: false }],
    "import/no-cycle": [2, { maxDepth: 2, ignoreExternal: true }],
    "import/no-self-import": "error",
    "no-restricted-syntax": [
      "error",
      {
        selector: "ExportDefaultDeclaration",
        message: "Prefer named exports",
      },
    ],
    "max-lines": ["error", 400],
  },
};
