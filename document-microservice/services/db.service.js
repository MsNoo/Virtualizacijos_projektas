const tempDb = {
  documents: [
    {
      id: 0,
      url: "https:google.com",
      name: "free-office.pdf",
      size: 4942442,
    },
    {
      id: 1,
      url: "https:google.com",
      name: "google-excel-hacks.docx",
      size: 2222221942,
    },
    { id: 2, url: "https:google.com", name: "not-a-virus.sh", size: 19422 },
  ],
};

export const getDocuments = () => {
  return tempDb;
};
