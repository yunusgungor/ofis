
Artık tabloyu iki farklı şekilde kullanabilirsiniz:

```tsx
const data = [
  { id: 1, name: 'Ahmet', age: 30 },
  { id: 2, name: 'Mehmet', age: 25 }
];

const columns = [
  { data: 'id', title: 'ID', readOnly: true },
  { data: 'name', title: 'Ad' },
  { data: 'age', title: 'Yaş', type: 'numeric' }
];

<Table data={data} columns={columns} />
```

```tsx
<Table>
  <Column data="id" title="ID" readOnly />
  <Column data="name" title="Ad" />
  <Column data="age" title="Yaş" type="numeric" />
</Table>
```

