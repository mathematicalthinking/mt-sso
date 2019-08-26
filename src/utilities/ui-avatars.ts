import { generateRandomLightColor } from './random-color';

export const generateEncUserAvatar = (
  username: string,
  firstName?: string | null,
  lastName?: string | null,
): string => {
  let baseName = '';

  let hasFirstName = typeof firstName === 'string';
  let hasLastName = typeof lastName === 'string';

  if (!hasFirstName && !hasLastName) {
    baseName += username;
  } else {
    if (hasFirstName) {
      baseName += firstName;
    }

    if (hasLastName) {
      if (baseName.length > 0) {
        baseName += ` ${lastName}`;
      } else {
        baseName += lastName;
      }
    }
  }
  let formattedName = baseName.split(' ').join('+');
  let bgColor = generateRandomLightColor();
  let bgString = bgColor.substring(1); // first char is #

  console.log({ bgColor });
  console.log({ bgString });
  console.log({ formattedName });

  let url = `https://ui-avatars.com/api/?rounded=true&color=ffffff&background=${bgString}&name=${formattedName}`;
  return url;
};
