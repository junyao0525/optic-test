export const formatStatus = (status: string | undefined): string => {
  if (!status) return ''; // Handle undefined or empty values

  return status
    .split(/[-_]/) // Split by hyphen or underscore
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
