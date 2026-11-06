/** Keeps the 10-digit Indian mobile number, whatever was typed, pasted or autofilled ("+91 98765-43210", "098765…"). */
export function toMobile(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length > 10 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}
