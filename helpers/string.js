exports.toTitleCase = (string) => {
  return string.replace(/\w*/g, (text) => {
    return text.charAt(0).toUpperCase() + text.substr(1);
  });
};
