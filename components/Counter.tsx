import cx from 'classnames';

type Props = {
  number: number;
  className?: string;
};

const Counter: React.FC<Props> = ({ number, className, ...props }) => {
  return (
    <div className={cx('bg-accent text-on-accent text-xs h-5 px-1.5 rounded-md text-center leading-5', className)} {...props}>
      {number}
    </div>
  );
};

export default Counter;
