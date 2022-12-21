import RefreshRuntime from '/@react-refresh';

RefreshRuntime.injectIntoGlobalHook(window);
// eslint-disable-next-line @typescript-eslint/no-empty-function
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;
