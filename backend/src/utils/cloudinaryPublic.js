export const extractPublicId = (secureUrl) => {
  const parts = secureUrl.split("/");
  const versionIndex = parts.findIndex((part) => part.startsWith("v"));
  const publicId = parts
    .slice(versionIndex + 1)
    .join("/")
    .replace(/\.[^/.]+$/, "");
  return decodeURIComponent(publicId);
};
