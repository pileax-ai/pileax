/**
 * Vite Extra
 *
 * @version 1.0
 */
import packageInfo from '../package.json';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';

const buildDependencies = () => {
  const list: Indexable[] = [];
  const dependencies = packageInfo.dependencies;
  const keys = [
    ...Object.keys(dependencies)
  ];
  keys.forEach((key) => {
    const packagePath = `../node_modules/${key}/package.json`;
    const packageFullPath = path.resolve(__dirname, packagePath);
    const raw = fs.readFileSync(packageFullPath, 'utf-8');
    const { name, version, description, repository, homepage, license } = JSON.parse(raw);
    const info = {
      name, version, description, repository, homepage, license
    };
    list.push(info);
  })
  return list as Indexable[];
}

export const viteConfig = (ctx: Indexable) => {
  const appInfo  = {
    package: {
      name: packageInfo.name,
      productName: packageInfo.productName,
      version: packageInfo.version,
      dependencies: buildDependencies(),
    },
    build: {
      mode: ctx.modeName,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }
  };

  return {
    rawDefine: {
      __APP_INFO__: JSON.stringify(appInfo)
    }
  };
}
