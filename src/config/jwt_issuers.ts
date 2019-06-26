import { appDisplayNamesHash } from './app_urls';

export function getIssuerName(issuerId: string): string | null {
  let encId = process.env.ENC_JWT_ISSUER_ID;
  let vmtId = process.env.VMT_JWT_ISSUER_ID;
  let mtSsoId = process.env.JWT_ISSUER_ID;

  if (encId === issuerId) {
    return appDisplayNamesHash.encompass;
  }

  if (vmtId === issuerId) {
    return appDisplayNamesHash.vmt;
  }

  if (mtSsoId === issuerId) {
    return appDisplayNamesHash.mtsso;
  }

  return null;
}
