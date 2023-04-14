import {
  ColDef,
  GetRowIdParams,
  GridReadyEvent,
  IViewportDatasource,
  IViewportDatasourceParams,
} from "@ag-grid-community/core";
import { AgGridReact, AgGridReactProps } from "@ag-grid-community/react";
import { useRef, useMemo, useCallback } from "react";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ColDefs: ColDef[] = [
  {
    colId: "itemId",
    headerName: "Item ID",
    field: "itemId",
  },
  { colId: "price", headerName: "Price", field: "price" },
];

interface Entry {
  itemId: number;
  price: number;
  rowId: number;
}

class MockServer {
  private data: Entry[] = [];
  private lowerBound = 0;
  private upperBound = 10;
  private listener?: (entry: Entry, rowId: number) => void;

  constructor() {
    this.data = Array(150)
      .fill(0)
      .map<Entry>((x, index) => ({
        itemId: index,
        price: 5 + Math.random() * index,
        rowId: index,
      }));
  }

  setBounds(lower: number, upper: number) {
    this.lowerBound = lower;
    this.upperBound = upper;
  }

  listen(fn: (entry: Entry, rowId: number) => void) {
    this.listener = fn;
  }

  emit(rowIndex: number) {
    if (!this.listener) return;

    if (rowIndex < this.lowerBound || rowIndex > this.upperBound) return;

    this.listener(this.data[rowIndex], rowIndex);
  }

  async startTracking() {
    // Initial
    //this.data.forEach((x, index) => this.emit(index));

    // 20 updates, 10 seconds apart each, or so
    for (let i = 0; i < 20; i++) {
      await delay(10000);

      for (let k = 0; k < this.data.length; k++) {
        await delay(100);
        const dataEntry = this.data[k];
        dataEntry.price = 5 + Math.random() * k;
        this.emit(k);
      }
    }
  }
}

const mockApi = new MockServer();

function getRowId(params: GetRowIdParams) {
  return params.data.rowId;
}

export const DemoGrid = ({ rowHeight }: AgGridReactProps) => {
  const viewportParamsRef = useRef<IViewportDatasourceParams>();
  const viewport: IViewportDatasource = useMemo(() => {
    console.log("Initializing viewport");

    return {
      init: (params) => {
        viewportParamsRef.current = params;
        params.setRowCount(150, true);
      },
      setViewportRange: async (firstRow, lastRow) => {
        mockApi.setBounds(firstRow, lastRow);
      },
    };
  }, []);

  const onGridReady = useCallback(
    (event: GridReadyEvent) => {
      mockApi.listen((update: any, rowIndex) => {
        // console.log({ update, rowIndex });
        const rowNode = viewportParamsRef.current!.getRow(rowIndex);

        if (!rowNode?.data) {
          viewportParamsRef.current!.setRowData({
            [rowIndex]: { ...update },
          });
        } else {
          for (const field in update) {
            const currentValueOnNode = (rowNode?.data || {})[field];
            const newValue = update[field];
            const runUpdate = currentValueOnNode !== newValue;

            if (runUpdate) {
              rowNode.setDataValue(field, newValue);
            }
          }
        }
      });

      mockApi.startTracking();
    },
    [viewport]
  );

  return (
    <div className="ag-theme-balham-dark" style={{ height: 600 }}>
      <AgGridReact
        key={rowHeight}
        getRowId={getRowId}
        rowModelType="viewport"
        viewportDatasource={viewport}
        viewportRowModelBufferSize={10}
        columnDefs={ColDefs}
        rowHeight={rowHeight}
        onGridReady={onGridReady}
      />
    </div>
  );
};
