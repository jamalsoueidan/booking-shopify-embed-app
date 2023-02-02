/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="vite/client" />

declare module '*';
interface Response {
  json: () => void;
}

interface Resource {
  id: string;
}
interface Resources {
  id?: string;
  selection: Resource[];
}
