export function getAllowedDomains(): (string | undefined)[] {
  return [process.env.ENC_URL, process.env.VMT_URL].filter(
    (url): boolean => url !== undefined
  );
}

export default getAllowedDomains();
