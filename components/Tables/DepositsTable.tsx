import { formatWeiToNumber, toLocalTime } from '@/helpers/formatters';
import { useUser } from '@/providers/UserProvider';
import numeral from 'numeral';
import Table from '.';

const DepositsTable = () => {
  const {
    state: { deposits },
  } = useUser();

  if (!deposits) {
    return null;
  }

  const tableHeaders = ['Asset', 'Amount', 'Date', 'Status'];
  const filteredDeposits = deposits.filter(({ token }) => token.type === 'ETH' || token.type === 'ERC20');
  const tableData = filteredDeposits.map(({ status, token, timestamp }) => {
    const amount = token?.data?.quantity;
    const amountFormatted = numeral(formatWeiToNumber(amount)).format('0[.]0[000]a');
    const symbol = token?.data?.symbol || 'ETH';
    const statusJSX = <span className="capitalize">{status}</span>;

    return [symbol, amountFormatted, toLocalTime(timestamp), statusJSX];
  });
  return <Table tableHeaders={tableHeaders} tableData={tableData} />;
};

export default DepositsTable;
