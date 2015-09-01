import {Auth} from './auth';
import config from '../modules/config';

const authCode = new Auth({domain:`${config.authApi}`})

export default {
    auth:authCode
}