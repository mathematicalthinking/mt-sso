export const appDisplayNamesHash = {
  vmt: 'Virtual Math Teams',
  encompass: 'EnCoMPASS',
  mtsso: 'Mathematical Thinking',
};

export const getAppHost = (appName: string): string | undefined => {
  if (appName === appDisplayNamesHash.encompass) {
    return process.env.ENC_URL;
  }
  if (appName === appDisplayNamesHash.vmt) {
    return process.env.VMT_URL;
  }
};

export default {
  appDisplayNamesHash,
  getAppHost,
};
