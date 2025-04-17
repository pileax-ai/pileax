/**
 * Format
 *
 * @author Xman
 * @version 1.0
 */
import { BigNumber } from 'bignumber.js';
import dayjs, { ManipulateType } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import zhCn from 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);
dayjs.locale(zhCn);

// ================================================================================
// Number
// ================================================================================
export function formatNumber(value: number, {
  decision = 2,
  unit = '',
  group = true
} = {}) {
  const absValue = Math.abs(value || 0);
  let bigValue = new BigNumber(value || 0);
  if (unit === '亿' && absValue > 1e+8) {
    bigValue = bigValue.dividedBy(1e+8);
  } else if (unit === '万' && absValue > 1e+4) {
    bigValue = bigValue.dividedBy(1e+4);
  }

  if (group) {
    const fmt = {
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
    }
    return bigValue.toFormat(decision, fmt);
  } else {
    return bigValue.toFixed(decision);
  }

}

// ================================================================================
// Time
// ================================================================================
export const timeMulti = (time :string, format = 'YYYY/MM/DD HH:mm:ss') => {
  return {
    fromNow: dayjs(time).fromNow(),
    timestamp: dayjs(time).format(format)
  }
}

export const timeAdd = (time :string, value: number, unit:ManipulateType = 'day') => {
  const start = dayjs(time);
  return start.add(value, unit);
}

export const dayDiff = (time :string) => {
  const now = dayjs();
  return now.diff(time, 'day');
}
