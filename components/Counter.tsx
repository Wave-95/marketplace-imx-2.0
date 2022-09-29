import cx from 'classnames';

interface CounterProps {
  number: number;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({ number, className, ...props }) => {
  return (
    <div
      className={cx('bg-accent text-on-accent text-xs h-5 px-1.5 rounded-md text-center leading-5', className)}
      {...props}
    >
      {number}
    </div>
  );
};

export default Counter;
