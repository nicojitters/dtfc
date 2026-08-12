// Type stub for @pagefind/default-ui — the package ships no declaration file.
// The real constructor accepts an options object; we declare only what the
// site uses so TypeScript stops complaining without losing strict mode elsewhere.
declare module '@pagefind/default-ui' {
  export interface PagefindUIOptions {
    element: string | HTMLElement;
    showSubResults?: boolean;
    pageSize?: number;
    [key: string]: unknown;
  }
  export class PagefindUI {
    constructor(options: PagefindUIOptions);
  }
}

declare module '@pagefind/default-ui/css/ui.css' {
  const url: string;
  export default url;
}
