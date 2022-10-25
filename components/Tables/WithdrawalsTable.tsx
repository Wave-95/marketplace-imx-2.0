import { formatWeiToNumber, toLocalTime } from '@/utils/formatters';
import { useUser } from '@/providers/UserProvider';
import numeral from 'numeral';
import Table from '.';

const WithdrawalsTable = () => {
  const {
    state: { withdrawals },
  } = useUser();

  if (!withdrawals) {
    return null;
  }

  const tableHeaders = ['Asset', 'Amount', 'Date', 'Status'];
  const filteredWithdrawals = withdrawals.filter(({ token }) => token.type === 'ETH' || token.type === 'ERC20');
  const tableData = filteredWithdrawals.map(({ rollup_status, token, timestamp }) => {
    const amount = token?.data?.quantity;
    const amountFormatted = numeral(formatWeiToNumber(amount)).format('0[.]0[000]a');
    const symbol = token?.data?.symbol || 'ETH';
    const statusJSX = <span className="capitalize">{rollup_status}</span>;

    return [symbol, amountFormatted, toLocalTime(timestamp), statusJSX];
  });
  return <Table tableHeaders={tableHeaders} tableData={tableData} />;
};

export default WithdrawalsTable;
