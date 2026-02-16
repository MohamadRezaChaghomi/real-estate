import Appointment from "@/models/Appointment";
import { connectDB } from "@/lib/mongodb";
import { serialize } from "@/lib/serialize";

export async function getAppointments(filters = {}, sort = {}) {
  await connectDB();
  try {
    let query = { deletedAt: null };
    // ... فیلترها
    if (filters.status) query.status = filters.status;
    if (filters.propertyId) query.propertyId = filters.propertyId;
    if (filters.customerId) query.customerId = filters.customerId;
    if (filters.fromDate || filters.toDate) {
      query.date = {};
      if (filters.fromDate) query.date.$gte = new Date(filters.fromDate);
      if (filters.toDate) query.date.$lte = new Date(filters.toDate);
    }

    let sortQuery = { date: 1, startTime: 1 };
    if (sort.field && sort.order) {
      sortQuery = { [sort.field]: sort.order === "asc" ? 1 : -1 };
    }

    let queryBuilder = Appointment.find(query)
      .populate("propertyId", "title address")
      .populate("customerId", "name phone")
      .sort(sortQuery)
      .lean(); // ✅

    if (filters.limit) queryBuilder = queryBuilder.limit(Number(filters.limit));

    const res = await queryBuilder;
    return serialize(res);
  } catch (error) {
    throw error;
  }
}

export async function getAppointment(id) {
  await connectDB();
  try {
    const res = await Appointment.findById(id)
      .populate("propertyId")
      .populate("customerId")
      .lean(); // ✅
    return serialize(res);
  } catch (error) {
    throw error;
  }
}

export async function createAppointment(data) {
  await connectDB();
  try {
    const appointment = await Appointment.create(data);
    return serialize(appointment.toObject());
  } catch (error) {
    throw error;
  }
}

export async function updateAppointment(id, data) {
  await connectDB();
  try {
    data.updatedAt = Date.now();
    const updated = await Appointment.findByIdAndUpdate(id, data, {
      new: true,
    }).lean(); // ✅
    return updated;
  } catch (error) {
    throw error;
  }
}

export async function deleteAppointment(id, soft = true) {
  await connectDB();
  try {
    if (soft) {
      return await Appointment.findByIdAndUpdate(
        id,
        { deletedAt: Date.now() },
        { new: true }
      ).lean(); // ✅
    } else {
      return await Appointment.findByIdAndDelete(id).lean(); // ✅
    }
  } catch (error) {
    throw error;
  }
}