# DAILO app (React) – guidelines for UI work

## Project snapshot

- React 19 + TypeScript 6 application built with Vite 8. It is a port of `../basic-app-angular`;
  the Angular project is the source of truth for views, styling and behavior. When porting or
  fixing a feature, compare with the matching Angular file and keep the result equivalent.
- Routing: React Router data router (`createBrowserRouter` in `src/main.tsx`). Routes live in
  `src/app/app.routes.tsx` and per-feature `*.routes.tsx` files. Route metadata (breadcrumb,
  description, clickable, title) goes into `handle` typed as `RouteHandle`
  (`src/app/core/router/route-handle.ts`) – the equivalent of Angular route `data`.
  - Administration views are lazy-loaded with `lazy: () => import(...)`; keep new feature views
    lazy the same way. Guard them with `PermissionsGuard` inside the `lazy` element.
  - Route errors (404, failed chunk loads, unexpected errors) are rendered by `RouteError`
    (`src/app/features/error/route-error/`), registered as `errorElement` in `src/main.tsx`.
- State: Redux Toolkit (`src/app/core/store/` – credentials, theme), TanStack Query for list
  tables. HTTP: axios with interceptors in `src/app/core/interceptors/`.
- Styling is Tailwind CSS 4. Design tokens and dark-mode variables live in
  `src/styles/styles.css` and `src/styles/shadcn.css`; global Tailwind styling is in
  `src/styles/tailwind.css`; app-specific overrides in `src/styles/custom.css`.
- UI components are locally copied **shadcn/ui** components (Radix UI). There is no Angular
  Material / ZardUI here – do not add another component library.
- All shadcn code lives in `src/app/shadcn/` and is imported through `@/shadcn/...`:
  - `src/app/shadcn/components/ui/` – shadcn components (button, input, dropdown-menu, select,
    sidebar, dialog, …). Some are customized to match the Angular look (e.g. `button.tsx` has
    `shape` and `loading`, menu/select items use `cursor-pointer`).
  - `src/app/shadcn/blocks/` – shadcn blocks (`sidebar-07`).
  - `src/app/shadcn/lib/utils.ts` (`cn`), `src/app/shadcn/hooks/`.
- `src/app/shared/` holds only application code (base hooks, `form-control-errors`,
  `mat-table`, `ui/*`, services, helpers, interfaces, utils). Do not put shadcn code there.
- New shadcn components are added with `npx shadcn@latest add <name>`. `components.json` maps
  the aliases to `@/shadcn/...`. Keep it in sync with the `@/*` → `src/app/*` alias in
  `tsconfig.app.json` and `vite.config.ts`.
- Translations are in `public/assets/i18n/{pl,en,es}/*.json` (i18next / react-i18next). Keep UI
  copy translatable (`t('...')`); do not hard-code user-facing strings. When adding a key, add it
  to all three languages. A new translation file must also be listed in
  `translationsFilesNames` in `src/app/core/services/i18n.service.ts`.
- Environments: `src/environments/` (`environment.ts` for `vite`, `environment.dev.ts` for
  `--mode dev`, `environment.prod.ts` for production), imported via `@environments`.

## Package and UI inventory

- Keep the existing stack: Radix UI (`radix-ui`), Tailwind, `class-variance-authority`,
  `clsx`, `tailwind-merge`, Font Awesome, `lucide-react`, `cmdk`, `sonner`, SweetAlert2,
  react-hook-form + yup, dayjs, marked.
- Toasts: `toastService.show(type, translationKey, life?, params?)` from
  `src/app/shared/services/translated-toast/`. Rendered by `<Toaster>` in `src/app/app.tsx`.
- Confirmations: `translatedSwalService` from `src/app/shared/services/translated-swal/`.
- Modals: `useAppDialog().open(Component, { title, width, data })` from
  `src/app/shared/components/ui/dialog/`. Content components use `useDialogRef()` and
  `useDialogData()`.
- Permissions: `PermissionsGuard` for routes, `<HasPermission only={[...]}>` for UI fragments.
- Tables: `useMatTable` + `MatTable`, `MatFilterHeader`, `MatSortHeader`, `MatTableToolbar`
  from `src/app/shared/components/mat-table/` (Tailwind re-implementation of the Angular
  `mat-table` + `matSort` + `mat-paginator`). Use them for every list view.

## shadcn/ui conventions

- Reuse the local components in `src/app/shadcn/` and `src/app/shared/components/ui/` before
  creating a new wrapper or adding a dependency (`Input`, `PasswordInput`, `Button`, `Checkbox`,
  `Select`, `Switch`, `MultiSelect`, `ErrorAlert`, `SaveButton`, `CancelButton`, …).
- Use the APIs implemented in this repository, not assumed APIs from another shadcn version.
  Inspect the component source (and its `cva` variants) before using a prop or variant.
- Prefer the established patterns:
  - `<Input {...form.register('field')} id="field" aria-invalid=... />` for native inputs.
  - `<Button type="submit" size="lg" loading={isLoading} disabled={...}>` for actions.
  - `<Controller>` + `<Checkbox checked onCheckedChange>` for boolean controls.
  - `<ErrorAlert message=... onClose=... />` for in-page errors.
- Use Tailwind utilities for layout. Use design tokens (`bg-primary`, `text-muted-foreground`,
  `border-border`, …) instead of theme-only workarounds, and always check the `dark:` variant.
- Merge classes with `cn(...)`; clickable elements need `cursor-pointer`.

## Forms: required pattern

Reference forms (see also `features/administration/*/update-*` and
`features/account/components/*`):

- `src/app/features/auth/login/`
- `src/app/features/auth/register/`
- `src/app/features/auth/password-reset/`
- `src/app/features/auth/password-reset-finish/`

When building or changing a form:

1. Preserve the existing yup schema, payload shape, service calls, navigation, loading state,
   toast behavior and server-error handling. A UI change must not change business behavior.
2. Use react-hook-form with `yupResolver(schema)`, `mode: 'onTouched'`, `defaultValues`, and a
   `<form onSubmit={form.handleSubmit(...)} noValidate>`. Use validation messages from
   `Validators` / `emailValidator` / `passwordMatchValidator` in `src/app/shared/helpers/`.
3. Use `useBaseUpdate(form)` (`src/app/shared/components/base-components/`) for `isLoading`,
   `error`, `serverErrors`, `clearServerErrors`, `isFormControlInvalid` and `controlErrors`.
4. Keep labels connected to controls via matching `htmlFor` and `id`; every interactive control
   needs a stable ID. Maintain `name`, useful `autoComplete` and the right native `type`.
5. Drive `aria-invalid` from `isFormControlInvalid(...)`.
6. Display validation with `controlErrors('field')` (renders `FormControlErrors` with client and
   server errors). Clear per-field server errors on input (`onKeyDown={() => clearServerErrors('field')}`).
7. Prevent duplicate submissions with `disabled={!form.formState.isValid || isLoading}` plus
   `loading={isLoading}`.
8. Password fields: use `PasswordInput` with a separate visibility state for the password and
   its confirmation. Keep the `mismatch` error from `passwordMatchValidator`.

## UI change workflow

1. Inspect the component, its imports, the shadcn source it uses and the matching Angular
   component in `../basic-app-angular`.
2. Change only the control(s) in scope. Preserve DOM semantics, keyboard behavior, form
   bindings, i18n keys and responsive layout.
3. Run the relevant checks after each coherent change:

   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

   For small, low-risk changes (a single class or style tweak, markup-only adjustments, copy,
   docs) skip `npm run build`: make the change, explain it briefly, and let the user verify it
   in the browser. Keep investigation proportional to the change.

4. Manually verify light and dark themes, disabled/loading state, client validation, server
   validation, keyboard navigation and mobile layout.

## Guardrails

- Do not modify generated output (`dist/`), `node_modules`, lockfiles, backend-facing interfaces,
  or translations unless the task explicitly requires it.
- Do not mix UI changes with unrelated refactors.
- `build/post-build.cjs` must stay CommonJS (`.cjs`) because `package.json` has
  `"type": "module"`.
- Keep changes focused, preserve the current file organization, and follow the repository
  Prettier configuration (100-column width, single quotes).
