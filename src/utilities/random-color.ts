import randomColor from 'randomcolor';

export const generateRandomLightColor = (): string => {
  return randomColor({ luminosity: 'light' });
};
