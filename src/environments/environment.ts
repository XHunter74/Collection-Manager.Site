// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    authUrl: 'https://localhost:5003/connect/',
    apiUrl: 'https://localhost:5003/api/',
    version: 'DEV',
    locales: ['en', 'uk'],
    defaultLocale: 'en',
    client_id: 'default-client',
    client_secret: '499D56FA-B47B-5199-BA61-B298D431C318',
};
