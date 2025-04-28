export function capitalizeFirstLetter(chain: string): string {
  if (!chain) return ""; // Return empty string if the input is empty
  return chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase();
}

export function convertToPascalCase(endpoint: string): string {
  return (
    endpoint
      // Match underscores and capitalize the next letter
      .replace(/_([a-z])/g, (_, letter) => " " + letter.toUpperCase())
      // Capitalize the first letter of the entire string
      .replace(/^(.)/, (match) => match.toUpperCase())
  );
}

export function convertToReadableFormat(endpoint: string): string {
  return (
    endpoint
      // Replace underscores with spaces and capitalize each word
      .replace(/([a-z])([A-Z])/g, "$1 $2") // For camelCase words like `getBlockByHash`, ensures the split
      .replace(/^./, (match) => match.toUpperCase()) // Capitalize the first letter
      .replace(/\bens\b/gi, "ENS") // Replace 'ens' or 'Ens' (case-insensitive word match) with 'ENS'
      .replace(/\bnft\b/gi, "NFT") // Replace 'nft' or 'Nft' (case-insensitive word match) with 'NFT'
      .replace(/\bnfts\b/gi, "NFTs") // Replace 'nfts' or 'Nfts' (case-insensitive) with 'NFTs'
      .trim()
  ); // Remove any leading/trailing spaces
}
