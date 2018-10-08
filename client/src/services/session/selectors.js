import store from 'ReactNativeAuth/src/store';

export const get = () => store.getState().services.session;
