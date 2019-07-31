export const switchcase = cases => defaultCase => key =>
    cases.hasOwnProperty(key) ? cases[key] : defaultCase;
