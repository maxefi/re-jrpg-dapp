export const shortenAddress = (address: Nullable<string>): string => {
  if (!address) {
    return 'Not connected...';
  }

  return `Connected as ${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
};
