export const truncateGoogleText = (value, limit) =>
  value.length > limit ? `${value.slice(0, limit - 3)}…` : value;

export const parseSchemaJson = (value) => JSON.parse(value);
