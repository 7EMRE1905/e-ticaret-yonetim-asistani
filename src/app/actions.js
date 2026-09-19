"use server";

import { prisma } from "@/lib/prisma";

// GET INITIAL DATA
export async function getInitialData() {
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany();
  const sales = await prisma.sale.findMany();
  const wholesalers = await prisma.wholesaler.findMany();
  let settings = await prisma.settings.findUnique({ where: { id: "1" } });
  
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: "1",
        partner1: "Yetkili Kişi",
        shipping: 0,
        firmaName: "Benim Mağazam",
        firmaPhone: "",
        firmaEmail: "",
        firmaAddress: "",
        firmaVkn: "",
        firmaVd: "",
        firmaIg: "",
        firmaTiktok: "",
        firmaLogo: "M"
      }
    });
  }

  return { categories, products, sales, wholesalers, settings };
}

// CATEGORIES
export async function addCategory(data) {
  return await prisma.category.create({ data });
}
export async function updateCategory(id, data) {
  return await prisma.category.update({ where: { id }, data });
}
export async function deleteCategory(id) {
  return await prisma.category.delete({ where: { id } });
}

// PRODUCTS
export async function addProduct(data) {
  return await prisma.product.create({ data });
}
export async function updateProduct(id, data) {
  return await prisma.product.update({ where: { id }, data });
}
export async function deleteProduct(id) {
  return await prisma.product.delete({ where: { id } });
}

// SALES (Transactional to update stock)
export async function addSale(data) {
  return await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.create({ data });
    await tx.product.update({
      where: { id: data.productId },
      data: { stock: { decrement: data.qty } }
    });
    return sale;
  });
}
export async function deleteSale(id) {
  return await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({ where: { id } });
    if (!sale) return;
    await tx.product.update({
      where: { id: sale.productId },
      data: { stock: { increment: sale.qty } }
    });
    return await tx.sale.delete({ where: { id } });
  });
}

// WHOLESALERS
export async function addWholesaler(data) {
  return await prisma.wholesaler.create({ data });
}
export async function updateWholesaler(id, data) {
  return await prisma.wholesaler.update({ where: { id }, data });
}
export async function deleteWholesaler(id) {
  return await prisma.wholesaler.delete({ where: { id } });
}

// SETTINGS
export async function updateSettingsData(data) {
  return await prisma.settings.update({
    where: { id: "1" },
    data
  });
}
