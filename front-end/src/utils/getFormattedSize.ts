const BYTES_IN_KB = 1_024 as const;
const SIZE_ABBREVIATIOnS = ["B", "KB", "MB", "GB", "TB"] as const;

export const getFormattedSize = (size: number) => {
  const sizeAbbreviationIndex = !size
    ? 0
    : Math.floor(Math.log(size) / Math.log(BYTES_IN_KB));

  const formattedSizeNumber =
    size / Math.pow(BYTES_IN_KB, sizeAbbreviationIndex);

  return `${formattedSizeNumber.toFixed(2)} ${
    SIZE_ABBREVIATIOnS[sizeAbbreviationIndex]
  }`;
};
