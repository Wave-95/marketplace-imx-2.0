export const ellipse = (address: string | null, width: number = 4) => {
  if (!address) {
    return '';
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`;
};
