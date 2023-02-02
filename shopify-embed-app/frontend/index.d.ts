/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="vite/client" />

declare module '*';

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}
