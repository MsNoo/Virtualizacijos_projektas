import { GridArrowDownwardIcon, type GridColDef } from "@mui/x-data-grid";

import { getFormattedSize } from "./getFormattedSize";

export const documentGridColumns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 300 },

  {
    field: "size",
    headerName: "Size",
    width: 160,
    renderCell: (params) => getFormattedSize(params.row.size),
  },
  {
    field: "url",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => {
      return (
        <a href={params.row.url} target="_blank" rel="noreferrer">
          <GridArrowDownwardIcon />
        </a>
      );
    },
  },

  {
    field: "uploader_ip",
    headerName: "Uploaded By",
    width: 200,
  },
  // This can lead to a security issue
  { field: "id", headerName: "ID", width: 90 },
];
