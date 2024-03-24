import React from "react";
import "./App.css";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";

export type ItemData = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  date: string;
};

function App() {
  const [data, setData] = React.useState<ItemData[]>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  console.log("App");

  const fetchData = () =>
    fetch("http://localhost:3000/data")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        } else return res.json();
      })
      .then((resData: ItemData[]) => setData(resData))
      .catch((error) => console.error("Error:", error));

  React.useEffect(() => {
    console.log("Fetch");
    fetchData();
  }, []);

  const memoizedData = React.useMemo<ItemData[]>(() => data, [data]);
  {
    
    const columns = [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "First name",
        accessorKey: "first_name",
      },
      {
        header: "Last name",
        accessorKey: "last_name",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Gender",
        accessorKey: "gender",
      },
      {
        header: "Date",
        accessorKey: "date",
      },
    ];

    const table = useReactTable<ItemData>({
      data: memoizedData,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      state: {
        pagination,
      },

      // manualPagination: false,
      // pageCount: 4,
      // rowCount: 30,
    });

    return (
      <div>
        {memoizedData ? (
          <div>
            <h2>Data:</h2>
            <div>
              <table>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  paddingTop: "10px",
                }}
              >
                <button
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {"<<"}
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {"<"}
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {">"}
                </button>
                <button
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {">>"}
                </button>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div>Page</div>
                  <strong>
                    {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount().toLocaleString()}
                  </strong>
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  | Go to page:
                  <input
                    type="number"
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      table.setPageIndex(page);
                    }}
                    style={{
                      border: "1px solid black",
                      borderRadius: "5px",
                      padding: "2px",
                      width: "35px",
                    }}
                  />
                </span>
                <select
                  style={{
                    border: "1px solid black",
                    borderRadius: "5px",
                    padding: "2px",
                  }}
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }
}
export default App;
