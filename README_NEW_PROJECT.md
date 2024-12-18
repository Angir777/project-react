# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Wtyczki:

Generate React CLI: npx generate-react-cli component Box

https://dev.to/tsamaya/eslint-and-prettier-configuration-for-react-project-2gij

Prosty server do testowania:
npm install -g serve
I w disc serve -s

## Projekt:

1. Instalacja poprzez Vite: npm create vite@latest
2. Podstawowa konfiguracja projektu pod eslinta i prettiera + budowanie aplikacji prod i dev
3. Routing, core logowania, redux do stanów globalnych
4. Widoki

## Kompilowanie plików motywu z SCSS do CSS by zmiana motywu działała
npx sass --watch src/assets/layout/themes/lara/:public/assets/layout/themes/lara/
Pliki od fontów należy przenieść 2x do katalogu 'public/assets/layout/themes/lara/lara-MOTYW/indigo'