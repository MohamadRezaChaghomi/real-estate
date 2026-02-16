import Transaction from "@/models/Transaction";
import { connectDB } from "@/lib/mongodb";
import { serialize } from "@/lib/serialize";

export async function getTransactions(filters = {}, sort = {}) {
  await connectDB();
  try {
    let query = { deletedAt: null };
    // ... فیلترها
    if (filters.type) query.type = filters.type;
    if (filters.category) query.category = filters.category;
    if (filters.propertyId) query.propertyId = filters.propertyId;
    if (filters.customerId) query.customerId = filters.customerId;
    if (filters.fromDate || filters.toDate) {
      query.date = {};
      if (filters.fromDate) query.date.$gte = new Date(filters.fromDate);
      if (filters.toDate) query.date.$lte = new Date(filters.toDate);
    }

    let sortQuery = { date: -1 };
    if (sort.field && sort.order) {
      sortQuery = { [sort.field]: sort.order === "asc" ? 1 : -1 };
    }

    let queryBuilder = Transaction.find(query)
      .populate("propertyId", "title")
      .populate("customerId", "name")
      .sort(sortQuery)
      .lean(); // ✅

    if (filters.limit) queryBuilder = queryBuilder.limit(Number(filters.limit));

    const res = await queryBuilder;
    return serialize(res);
  } catch (error) {
    throw error;
  }
}

export async function getTransaction(id) {
  await connectDB();
  try {
    const res = await Transaction.findById(id)
      .populate("propertyId")
      .populate("customerId")
      .lean(); // ✅
    return serialize(res);
  } catch (error) {
    throw error;
  }
}

export async function createTransaction(data) {
  await connectDB();
  try {
    const transaction = await Transaction.create(data);
    return serialize(transaction.toObject());
  } catch (error) {
    throw error;
  }
}

export async function updateTransaction(id, data) {
  await connectDB();
  try {
    data.updatedAt = Date.now();
    const updated = await Transaction.findByIdAndUpdate(id, data, {
      new: true,
    }).lean(); // ✅
    return updated;
  } catch (error) {
    throw error;
  }
}

export async function deleteTransaction(id, soft = true) {
  await connectDB();
  try {
    if (soft) {
      return await Transaction.findByIdAndUpdate(
        id,
        { deletedAt: Date.now() },
        { new: true }
      ).lean(); // ✅
    } else {
      return await Transaction.findByIdAndDelete(id).lean(); // ✅
    }
  } catch (error) {
    throw error;
  }
}

export async function getMonthlyIncome() {
  await connectDB();
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await Transaction.aggregate([
      {
        $match: {
          type: "income",
          deletedAt: null,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return result.length > 0 ? result[0].total : 0;
  } catch (error) {
    throw error;
  }
}