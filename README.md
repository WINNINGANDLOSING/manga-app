# Turborepo starter

This is an official starter Turborepo.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

```
Nest-Next-Authentication
├─ .gitignore
├─ .npmrc
├─ apps
│  ├─ api
│  │  ├─ .eslintrc.js
│  │  ├─ .git
│  │  │  ├─ config
│  │  │  ├─ description
│  │  │  ├─ HEAD
│  │  │  ├─ hooks
│  │  │  │  ├─ applypatch-msg.sample
│  │  │  │  ├─ commit-msg.sample
│  │  │  │  ├─ fsmonitor-watchman.sample
│  │  │  │  ├─ post-update.sample
│  │  │  │  ├─ pre-applypatch.sample
│  │  │  │  ├─ pre-commit.sample
│  │  │  │  ├─ pre-merge-commit.sample
│  │  │  │  ├─ pre-push.sample
│  │  │  │  ├─ pre-rebase.sample
│  │  │  │  ├─ pre-receive.sample
│  │  │  │  ├─ prepare-commit-msg.sample
│  │  │  │  ├─ push-to-checkout.sample
│  │  │  │  ├─ sendemail-validate.sample
│  │  │  │  └─ update.sample
│  │  │  ├─ info
│  │  │  │  └─ exclude
│  │  │  ├─ objects
│  │  │  │  ├─ info
│  │  │  │  └─ pack
│  │  │  └─ refs
│  │  │     ├─ heads
│  │  │     └─ tags
│  │  ├─ .gitignore
│  │  ├─ .prettierrc
│  │  ├─ api
│  │  │  └─ auth
│  │  ├─ nest-cli.json
│  │  ├─ package.json
│  │  ├─ prisma
│  │  │  ├─ migrations
│  │  │  │  ├─ 20241120111006_adding
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20241120140428_adding
│  │  │  │  │  └─ migration.sql
│  │  │  │  └─ migration_lock.toml
│  │  │  └─ schema.prisma
│  │  ├─ README.md
│  │  ├─ src
│  │  │  ├─ app.controller.spec.ts
│  │  │  ├─ app.controller.ts
│  │  │  ├─ app.module.ts
│  │  │  ├─ app.service.ts
│  │  │  ├─ auth
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ auth.module.ts
│  │  │  │  ├─ auth.service.ts
│  │  │  │  ├─ config
│  │  │  │  │  ├─ google-oauth.config.ts
│  │  │  │  │  ├─ jwt.config.ts
│  │  │  │  │  └─ refresh.config.ts
│  │  │  │  ├─ decorators
│  │  │  │  │  ├─ public.decorator.ts
│  │  │  │  │  └─ roles.decorator.ts
│  │  │  │  ├─ dto
│  │  │  │  ├─ enums
│  │  │  │  │  └─ role.enum.ts
│  │  │  │  ├─ guards
│  │  │  │  │  ├─ google-auth
│  │  │  │  │  │  └─ google-auth.guard.ts
│  │  │  │  │  ├─ jwt-strategy
│  │  │  │  │  │  └─ jwt-auth.guard.ts
│  │  │  │  │  ├─ local-strategy
│  │  │  │  │  │  └─ local-auth.guard.ts
│  │  │  │  │  ├─ refresh-auth
│  │  │  │  │  │  └─ refresh-auth.guard.ts
│  │  │  │  │  └─ roles
│  │  │  │  │     ├─ practice.ts
│  │  │  │  │     └─ roles.guard.ts
│  │  │  │  ├─ strategies
│  │  │  │  │  ├─ google-strategy.ts
│  │  │  │  │  ├─ jwt-strategy.ts
│  │  │  │  │  ├─ local-strategy.ts
│  │  │  │  │  └─ refresh-token-strategy.ts
│  │  │  │  └─ types
│  │  │  │     ├─ auth-jwtPayload.d.ts
│  │  │  │     └─ current-User.d.ts
│  │  │  ├─ main.ts
│  │  │  ├─ prisma
│  │  │  │  ├─ prisma.service.spec.ts
│  │  │  │  └─ prisma.service.ts
│  │  │  └─ user
│  │  │     ├─ dto
│  │  │     │  └─ create-user.dto.ts
│  │  │     ├─ user.controller.ts
│  │  │     ├─ user.module.ts
│  │  │     └─ user.service.ts
│  │  ├─ test
│  │  │  ├─ app.e2e-spec.ts
│  │  │  └─ jest-e2e.json
│  │  └─ tsconfig.json
│  └─ web
│     ├─ .eslintrc.js
│     ├─ .gitignore
│     ├─ app
│     │  ├─ api
│     │  │  └─ auth
│     │  │     ├─ google
│     │  │     │  └─ callback
│     │  │     │     └─ route.ts
│     │  │     └─ update
│     │  │        └─ route.ts
│     │  ├─ auth
│     │  │  ├─ layout.tsx
│     │  │  ├─ meo
│     │  │  │  ├─ meoForm.tsx
│     │  │  │  └─ page.tsx
│     │  │  ├─ signin
│     │  │  │  ├─ page.tsx
│     │  │  │  └─ signInForm.tsx
│     │  │  └─ signup
│     │  │     ├─ page.tsx
│     │  │     └─ signupForm.tsx
│     │  ├─ dashboard
│     │  │  └─ page.tsx
│     │  ├─ favicon.ico
│     │  ├─ fonts
│     │  │  ├─ GeistMonoVF.woff
│     │  │  └─ GeistVF.woff
│     │  ├─ globals.css
│     │  ├─ layout.tsx
│     │  ├─ page.module.css
│     │  ├─ page.tsx
│     │  └─ profile
│     │     └─ page.tsx
│     ├─ components
│     │  └─ ui
│     │     ├─ appBar.tsx
│     │     ├─ button.tsx
│     │     ├─ input.tsx
│     │     ├─ label.tsx
│     │     ├─ signButton.tsx
│     │     └─ submitButton.tsx
│     ├─ components.json
│     ├─ lib
│     │  ├─ actions.ts
│     │  ├─ auth.ts
│     │  ├─ authFetch.ts
│     │  ├─ constants.ts
│     │  ├─ session.ts
│     │  ├─ type.ts
│     │  └─ utils.ts
│     ├─ middleware.ts
│     ├─ next-env.d.ts
│     ├─ next.config.mjs
│     ├─ note.txt
│     ├─ package.json
│     ├─ postcss.config.js
│     ├─ public
│     │  ├─ file-text.svg
│     │  ├─ globe.svg
│     │  ├─ next.svg
│     │  ├─ vercel.svg
│     │  └─ window.svg
│     ├─ README.md
│     ├─ tailwind.config.js
│     └─ tsconfig.json
├─ package-lock.json
├─ package.json
├─ packages
│  ├─ eslint-config
│  │  ├─ library.js
│  │  ├─ next.js
│  │  ├─ package.json
│  │  ├─ react-internal.js
│  │  └─ README.md
│  ├─ typescript-config
│  │  ├─ base.json
│  │  ├─ nextjs.json
│  │  ├─ package.json
│  │  └─ react-library.json
│  └─ ui
│     ├─ .eslintrc.js
│     ├─ package.json
│     ├─ src
│     │  ├─ button.tsx
│     │  ├─ card.tsx
│     │  └─ code.tsx
│     ├─ tsconfig.json
│     ├─ tsconfig.lint.json
│     └─ turbo
│        └─ generators
│           ├─ config.ts
│           └─ templates
│              └─ component.hbs
├─ README.md
└─ turbo.json

```#   m a n g a - a p p  
 