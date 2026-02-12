import Customer from "@/models/Customer";
import { connectDB } from "@/lib/mongodb";

export async function getCustomers(filters = {}, sort = {}) {
  await connectDB();
  try {
    let query = { deletedAt: null };

    if (filters.desiredPropertyType) query.desiredPropertyType = filters.desiredPropertyType;
    if (filters.desiredSaleType) query.desiredSaleType = filters.desiredSaleType;
    if (filters.minPrice || filters.maxPrice) {
      query.desiredPrice = {};
      if (filters.minPrice) query.desiredPrice.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.desiredPrice.$lte = Number(filters.maxPrice);
    }

    let sortQuery = { createdAt: -1 };
    if (sort.field && sort.order) {
      sortQuery = { [sort.field]: sort.order === "asc" ? 1 : -1 };
    }

    let queryBuilder = Customer.find(query)
      .sort(sortQuery)
      .lean(); // ✅

    if (filters.limit) {
      queryBuilder = queryBuilder.limit(Number(filters.limit));
    }

    return await queryBuilder;
  } catch (error) {
    console.error("خطا در getCustomers:", error);
    throw error;
  }
}

export async function getCustomer(id) {
  await connectDB();
  try {
    return await Customer.findById(id).lean(); // ✅
  } catch (error) {
    console.error("خطا در getCustomer:", error);
    throw error;
  }
}

export async function createCustomer(data) {
  await connectDB();
  try {
    const count = await Customer.countDocuments();
    data.customerNumber = `CUST-${String(count + 1).padStart(6, "0")}`;
    const customer = await Customer.create(data);
    return customer.toObject(); // ✅
  } catch (error) {
    console.error("خطا در createCustomer:", error);
    throw error;
  }
}

export async function updateCustomer(id, data) {
  await connectDB();
  try {
    data.updatedAt = Date.now();
    const updated = await Customer.findByIdAndUpdate(id, data, {
      new: true,
    }).lean(); // ✅
    return updated;
  } catch (error) {
    console.error("خطا در updateCustomer:", error);
    throw error;
  }
}

export async function deleteCustomer(id, soft = true) {
  await connectDB();
  try {
    if (soft) {
      return await Customer.findByIdAndUpdate(
        id,
        { deletedAt: Date.now() },
        { new: true }
      ).lean(); // ✅
    } else {
      return await Customer.findByIdAndDelete(id).lean(); // ✅
    }
  } catch (error) {
    console.error("خطا در deleteCustomer:", error);
    throw error;
  }
}