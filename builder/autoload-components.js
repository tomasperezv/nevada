'use strict';

/**
 * This module generates the components path placed in the 'components' folder,
 * and generates them as an array that will be used in order to compose the webpack config.
 * @module autoloadComponents
 */
import fs from 'fs';
import path from 'path';
import moduleJSResolveName from './modulejs-resolve-name';

const SRC_COMPONENTS_PATH = './src/component';
const AVAILABLE_EXTENSIONS = ['.js', '.coffee'];

const componentDirectories = fs.readdirSync(SRC_COMPONENTS_PATH);
const components = [];
componentDirectories.forEach((currentComponentDirectory) => {
  const directoryPath = `${SRC_COMPONENTS_PATH}/${currentComponentDirectory}`;
  const componentFiles = fs.readdirSync(directoryPath);
  // The result is a directory, we need to do it again to get the files
  componentFiles.map((currentComponentFile) => {
    const extension = path.extname(currentComponentFile);
    if (AVAILABLE_EXTENSIONS.indexOf(extension) >= 0){
      const filepath = `${directoryPath}/${currentComponentFile}`;

      const templatePath = `${directoryPath}/template.html`;
      let template = '';
      try {
        // Resolve component template
        if (fs.statSync(templatePath).isFile()) {
          template = templatePath;
        }
      } catch (e) {
        // eslint-disable-line no-empty
      }

      components.push({
        path: filepath,
        name: moduleJSResolveName(currentComponentFile),
        templatePath: template
      });
    }
  });
});

module.exports = components;
