import { randomUUID } from 'node:crypto'

export class MiscUtil {
  static currentDate = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  };

  static uuid = (hyphen = false) => {
    return hyphen
      ? randomUUID()
      : randomUUID().replaceAll('-', '');
  }
}
