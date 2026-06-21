export const formatKRW = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date).replace(/\. /g, '.').replace(/\.$/, '');
};

export const isExpired = (validTo: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expirationDate = new Date(validTo);
  expirationDate.setHours(0, 0, 0, 0);
  return expirationDate < today;
};

export const getDDay = (validTo: string): { label: string, isUrgent: boolean } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiration = new Date(validTo);
  expiration.setHours(0, 0, 0, 0);
  
  const diffTime = expiration.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { label: '만료됨', isUrgent: false };
  if (diffDays === 0) return { label: 'D-Day', isUrgent: true };
  if (diffDays <= 3) return { label: `D-${diffDays}`, isUrgent: true };
  return { label: `D-${diffDays}`, isUrgent: false };
};
