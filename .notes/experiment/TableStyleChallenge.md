```tsx

const columns = Array.from({ length: 26 }, (_, index) => ({
    data: String.fromCharCode(65 + index),
    title: String.fromCharCode(65 + index),
    width: 150,
    wordWrap: true
  }));

```
---

```css

.excel-table .handsontable td {
    padding: 4px 8px;
    height: auto;
    line-height: 1.4;
    white-space: normal;
    overflow: visible;
    max-width: 150px;
    word-break: break-word;
}

```
---

```tsx

<HotTable 
    ref={hotRef}
    data={tableData}
    columns={columns}
    rowHeaders={true}
    colHeaders={true}
    manualColumnMove={true}
    manualRowMove={true}
    manualColumnResize={true}
    manualRowResize={true}
    contextMenu={true}
    comments={true}
    mergeCells={true}
    autoColumnSize={{
    syncLimit: 300,
    useHeaders: true,
    samplingRatio: 0.3
    }}
    stretchH="all"
    autoRowSize={true}
    dropdownMenu={true}
    multiColumnSorting={true}
    afterChange={handleDataChange}
    afterSelection={afterSelection}
    cells={cells}
    formulas={{
    engine: HyperFormula,
    sheetName: 'Sheet1',
    }}
    height="calc(100vh - 120px)"
    licenseKey="non-commercial-and-evaluation"
    className="excel-table"
    wordWrap={true}
/>

```
---

