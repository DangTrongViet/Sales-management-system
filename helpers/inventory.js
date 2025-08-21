// helpers/inventory.js
exports.getAvailableQty = (product) => {
  // Ưu tiên field stock; fallback sang quantity; cuối cùng là 0
  return Number(product?.stock ?? product?.quantity ?? 0);
};
