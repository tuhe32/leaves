export function getRequestType(contentType: string) {
  const typeRes = {
    isText: false,
    isUrlencoded: false,
    isJson: false,
    isFormData: false,
  };
  switch (contentType) {
    case "application/json":
      typeRes.isJson = true;
      break;

    case "application/x-www-form-urlencoded":
      typeRes.isUrlencoded = true;
      break;

    default:
      typeRes.isText = true;
  }
  return typeRes;
}
