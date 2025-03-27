/**
 * Vite
 *
 * @version 1.0
 */
const packageInfo = require('../package.json');
const dayjs = require('dayjs');
const buildDependencies = () => {
  const list = [];
  const dependencies = packageInfo.dependencies;
  const keys = [
    ...Object.keys(dependencies)
  ];
  keys.forEach((key) => {
    const path = `../node_modules/${key}/package.json`;
    const { name, version, description, repository, homepage, license } = require(path);
    const info = {
      name, version, description, repository, homepage, license
    };
    list.push(info);
  })
  return list;
}

module.exports = {
  extra: (ctx) => {
    // const list = buildPackageList();
    // console.log(list);

    const appInfo  = {
      package: {
        name: packageInfo.name,
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
}
