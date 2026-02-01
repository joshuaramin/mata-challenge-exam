import {
  CreateSaleInput,
  GetSalesByMonthInput,
} from "@/lib/interface/sale.interface";
import { prisma } from "@/lib/prisma";

export const GetSalesByMonth = async ({ month }: GetSalesByMonthInput) => {
  const mon: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [year, monthNum] = month.split("-").map(Number);

  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 1);

  const sales = await prisma.sales.findMany({
    where: {
      created_at: { gte: startDate, lt: endDate },
    },
    include: { customer: true, Items: { include: { product: true } } },
  });

  const totalSales = sales.reduce((acc, sales) => acc + sales.total_amount, 0);

  return {
    month: mon[monthNum - 1],
    year,
    totalSales: Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(totalSales),
    sales,
  };
};

export const CreateSale = async ({ customer_id, items }: CreateSaleInput) => {
  if (items.length === 0) {
    throw new Error("No items to sell");
  }

  const productIds = items.map((item) => item.product_id);
  const products = await prisma.product.findMany({
    where: { product_id: { in: productIds }, is_deleted: false },
  });

  if (products.length !== items.length) {
    throw new Error("One or more products not found");
  }

  let totalAmount = 0;

  const salesItemsData = items.map((item) => {
    const product = products.find((p) => p.product_id === item.product_id);

    if (!product) {
      throw new Error(`Product with ID ${item.product_id} not found`);
    }
    if (product.quantity === 0) {
      throw new Error(`Product ${product.name} is out of stock`);
    }
    const subTotal = product.price * item.quantity;
    totalAmount += subTotal;

    return {
      product_id: item.product_id,
      quantity: item.quantity,
      price: product.price,
      sub_total: subTotal,
    };
  });

  const sale = await prisma.sales.create({
    data: {
      customer: {
        connect: { customer_id },
      },
      total_amount: totalAmount,
      Items: {
        create: salesItemsData.map(
          ({ price, product_id, quantity, sub_total }) => ({
            quantity,
            subTotal: sub_total,
            unitPrice: price,
            product: { connect: { product_id } },
          }),
        ),
      },
    },
    include: {
      Items: {
        include: { product: true },
      },
    },
  });

  for (const item of items) {
    await prisma.product.update({
      where: { product_id: item.product_id },
      data: { quantity: { decrement: item.quantity } },
    });
  }

  return sale;
};
