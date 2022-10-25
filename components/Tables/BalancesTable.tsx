import { formatWeiToNumber } from '@/utils/formatters';
import { useUser } from '@/providers/UserProvider';
import numeral from 'numeral';
import Table from '.';

const BalancesTable = () => {
  const {
    state: {
      balances: { l2: l2Balances },
    },
  } = useUser();

  const tableHeaders = ['Asset', 'L2 Balance'];
  const tableData = Object.entries(l2Balances).map(([symbol, data], idx) => {
    const balance = data?.balance || '0';
    const balanceFormatted = numeral(formatWeiToNumber(balance)).format('0[.]0[000]a');
    return [symbol, balanceFormatted];
  });

  return <Table tableHeaders={tableHeaders} tableData={tableData} />;
};

export default BalancesTable;
