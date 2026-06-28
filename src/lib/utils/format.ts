export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    return `+92${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `+92${digits}`;
  }
  if (digits.startsWith("92")) {
    return `+${digits}`;
  }
  return phone;
}
