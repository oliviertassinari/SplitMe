/* eslint-disable no-console */

import path from 'path';
import gm from 'gm';

const display = {
  success: (str) => {
    console.log(`✓ ${str}`);
  },
  error: (str) => {
    console.log(`✗ ${str}`);
  },
  header: (str) => {
    console.log('');
    console.log(` ${str}`);
    console.log('');
  },
};

const ICON_FILE = path.join(__dirname, '../icon/v0_1024x1024_ios.png');

const platforms = [
  {
    name: 'ios',
    iconsPath: '/resources/icons/ios',
    icons: [
      29,
      40,
      58,
      76,
      80,
      87,
      120,
      152,
      167,
      180,
    ],
  },
];

function generateForApp() {
  display.header('Generating Icons');
  return Promise.all(
    platforms
      .map((platform) =>
        generateForFlatform(platform)
      )
  );
}

function generateForFlatform(platform) {
  display.header(`Generating Icons for ${platform.name}`);

  return Promise.all(
    platform.icons.map((icon) =>
      new Promise((resolve, reject) => {
        gm(path.join(ICON_FILE))
          .resize(icon, icon)
          .write(path.join(__dirname, platform.iconsPath, `${icon}x${icon}.png`), (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
              display.success(`Size ${icon} created`);
            }
          });
      })
    )
  );
}

generateForApp()
  .catch((err) => {
    setTimeout(() => {
      display.error(err);
      throw err;
    }, 0);
  });
