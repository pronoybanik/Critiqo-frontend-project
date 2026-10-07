const getBackendApiBase = (): string => {
  const configuredBase = process.env.NEXT_PUBLIC_BASE_API;
  if (!configuredBase) {
    throw new Error("NEXT_PUBLIC_BASE_API is not configured.");
  }

  const normalizedBase = configuredBase.replace(/\/+$/, "");
  if (/\/api\/v\d+$/i.test(normalizedBase)) {
    return normalizedBase;
  }
  if (/\/api$/i.test(normalizedBase)) return normalizedBase;
  return `${normalizedBase}/api`;
};

export const getBackendApiUrl = (path: string): string =>
  `${getBackendApiBase()}/${path.replace(/^\/+/, "")}`;
