export const getCredits = (): `\u00A9 ${number} ${string}` => {
  // better scalability instead of storing in a string
  const _CREDITS = {
    authors: [
      "Jonas Girdzijauskas",
      "Akvilė Mickevičūtė",
      "Tadas Kastanauskas",
      "Renata Marcinauskaitė",
    ],
  } as const;
  const _authorsString = _CREDITS.authors.join(", ");

  return `© ${new Date().getFullYear()} ${_authorsString}` as const;
};
