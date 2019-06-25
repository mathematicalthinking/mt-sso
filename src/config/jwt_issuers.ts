import { appDisplayNamesHash } from './app_urls';

export function getEncIssuerId(): string | undefined {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.ENC_JWT_ISSUER_ID_PROD;
  }

  if (envName === 'staging') {
    return process.env.ENC_JWT_ISSUER_ID_STAGING;
  }

  if (envName === 'test') {
    return process.env.ENC_JWT_ISSUER_ID_TEST;
  }

  return process.env.ENC_JWT_ISSUER_ID_DEV;
}

export function getVmtIssuerId(): string | undefined {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.VMT_JWT_ISSUER_ID_PROD;
  }

  if (envName === 'staging') {
    return process.env.VMT_JWT_ISSUER_ID_STAGING;
  }

  if (envName === 'test') {
    return process.env.VMT_JWT_ISSUER_ID_TEST;
  }

  return process.env.VMT_JWT_ISSUER_ID_DEV;
}

export function getMtIssuerId(): string | undefined {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.JWT_ISSUER_ID_PROD;
  }

  if (envName === 'staging') {
    return process.env.JWT_ISSUER_ID_STAGING;
  }

  if (envName === 'test') {
    return process.env.JWT_ISSUER_ID_TEST;
  }

  return process.env.JWT_ISSUER_ID_DEV;
}

export function getIssuerName(issuerId: string): string | null {
  let encId = getEncIssuerId();
  let vmtId = getVmtIssuerId();
  let mtSsoId = getMtIssuerId();

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
