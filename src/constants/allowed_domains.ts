import { getEncUrl, getVmtUrl } from '../config/app_urls';

export function getAllowedDomains(): (string | undefined)[] {
  return [getEncUrl(), getVmtUrl()].filter((url): boolean => url !== undefined);
}

export default getAllowedDomains();
