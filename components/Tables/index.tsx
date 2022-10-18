type Props = {
  tableHeaders: string[];
  tableData: any[][];
};

const Table: React.FC<Props> = ({ tableHeaders, tableData }) => {
  return (
    <table className="table-fixed w-full border-collapse">
      <thead className="bg-table-header text-left h-[50px] border border-normal">
        <tr>
          {tableHeaders.map((header, idx) => (
            <th className="px-4 py-2 text-sm text-secondary font-semibold" key={`th-${idx}`}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((values, idx) => {
          return (
            <tr className="border border-normal" key={`tr-${idx}`}>
              {values.map((value, idx) => (
                <td className="px-4 py-2" key={`td-${idx}`}>
                  {value}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
