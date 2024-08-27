import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  { 
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser
    },
    settings: {
      react: {
        version: "detect"  // Automatyczne wykrywanie wersji Reacta
      }
    },
    rules: {
      semi: ["error", "always"],  // Dodaj regułę wymagającą średnika
      "react/react-in-jsx-scope": "off"
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
];
