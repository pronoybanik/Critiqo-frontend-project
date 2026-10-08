const getBackendApiBase = (): string => {
  const configuredBase =
    process.env.NEXT_PUBLIC_BASE_API ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/v1";

  const normalizedBase = configuredBase.replace(/\/+$/, "");
  if (/\/api\/v\d+$/i.test(normalizedBase)) {
    return normalizedBase;
  }
  if (/\/api$/i.test(normalizedBase)) return normalizedBase;
  return `${normalizedBase}/api`;
};

export const getBackendApiUrl = (path: string): string =>
  `${getBackendApiBase()}/${path.replace(/^\/+/, "")}`;

