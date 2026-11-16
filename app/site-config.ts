// Where player feedback goes.
export const FEEDBACK_EMAIL = "staticsilo@gmail.com";

// Web3Forms access key for the "Fathomless Maw Feedback" form (app.web3forms.com). The key only lets
// someone SEND to the inbox above, never read it, so it is safe in the browser; Web3Forms' own
// snippet puts it in the page as a hidden field. NEXT_PUBLIC_WEB3FORMS_KEY (in .env.local or on the
// host) overrides it. If it is ever emptied the form opens the visitor's own mail app instead.
export const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "712b6395-35b7-4357-8d1f-4e88d0a50c2e";

// Where supporters can donate.
export const KOFI_URL = "https://ko-fi.com/staticsilo";
