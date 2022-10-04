import { Asset } from '@imtbl/core-sdk';
import React from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';

type MetadataProps = {
  keys: Array<keyof Asset['metadata']>;
  metadata: Asset['metadata'];
  className?: string;
};
const Metadata: React.FC<MetadataProps> = ({ keys, metadata, className, ...props }) => {
  const router = useRouter();
  const redirectToMarketplace = (key: string, value: string | null) => () => {
    if (key && value) {
      router.push(`/?${key}=${value}`);
    }
  };

  return (
    <div className={cx('space-y-3', className)} {...props}>
      <h5 className="mb-4 mt-4">Properties</h5>
      {keys.map((key) => {
        const value = (metadata && metadata[key]) || null;
        return (
          <div className="flex justify-between items-center" key={`metadata-${key}`}>
            <div className="text-secondary capitalize text-sm">{key}</div>
            <div
              className={cx('text-badge-neutral bg-badge-neutral rounded-xl px-3 py-1 capitalize text-sm', {
                ['hover:cursor-pointer']: value,
              })}
              onClick={redirectToMarketplace(key, value)}
            >
              {value || 'n/a'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Metadata;
