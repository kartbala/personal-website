export function estimateSavings(userBill, planPrice) {
  const monthly = Number(userBill) - Number(planPrice);
  return monthly * 12;
}
