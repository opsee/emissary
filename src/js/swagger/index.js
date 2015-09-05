import {Auth} from './auth';
// import {Api} from './api';
import config from '../modules/config';

const authCode = new Auth({domain:config.authApi});
// const apiCode = new Api({domain:config.api});

export default {
    auth:authCode,
    // api:apiCode
}