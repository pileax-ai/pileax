import libMessageEn from 'core/messages/en.json';
import libMessageZh from 'core/messages/zh.json';
import libMessageZhHans from 'core/messages/zh.json';
import libMessageZhHant from 'core/messages/zh-hant.json';

import messageEn from './messages/en.json';
import messageZh from './messages/zh.json';
import messageZhHans from './messages/zh.json';
import messageZhHant from './messages/zh-hant.json';

export default {
  'en': Object.assign(libMessageEn, messageEn) as Record<string, any>,
  'zh': Object.assign(libMessageZh, messageZh) as Record<string, any>,
  'zh-hans': Object.assign(libMessageZhHans, messageZhHans) as Record<string, any>,
  'zh-hant': Object.assign(libMessageZhHant, messageZhHant) as Record<string, any>,
};
