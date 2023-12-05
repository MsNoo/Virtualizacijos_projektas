import type { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import { getFormattedSize } from "./getFormattedSize";

export const documentGridColumns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 200 },
  {
    field: "size",
    headerName: "Size",
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      getFormattedSize(params.row.size),
  },
  {
    field: "url",
    headerName: "Actions",
    width: 200,
    renderCell: (params) => {
      return (
        <a href={params.row.url} target="_blank">
          Download
        </a>
      );
    },
  },
  // This can lead to a security issue
  { field: "id", headerName: "ID", width: 90 },
];
