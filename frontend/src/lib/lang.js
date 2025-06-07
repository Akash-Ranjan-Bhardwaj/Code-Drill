function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
    103: "C",
    105: "C++",
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

export { getLanguageName };

export function getLanguageId(language) {
  const languageMap = {
    "PYTHON": 71,
    "JAVASCRIPT": 63,
    "JAVA": 62,
    "TYPESCRIPT": 74,
    "C": 103,
    "C++": 105,
    "CPP": 105, // Optional alias
  };
  return languageMap[language.toUpperCase()];
}
