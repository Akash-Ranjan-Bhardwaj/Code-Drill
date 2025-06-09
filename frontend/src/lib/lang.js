function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    91: "Java",
    103: "C",
    76: "C++",
  };
  console.log(LANGUAGE_NAMES[languageId]);
  return LANGUAGE_NAMES[languageId] || "pata nahi kon sa launguage hai";
}

export { getLanguageName };

export function getLanguageId(language) {
  const languageMap = {
    "PYTHON": 71,
    "JAVASCRIPT": 63,
    "JAVA": 91,
    "TYPESCRIPT": 74,
    "C": 103,
    "C++": 76,
    "CPP": 76, // Optional alias
  };
  console.log(languageMap[language.toUpperCase()]);
  return languageMap[language.toUpperCase()];
}
