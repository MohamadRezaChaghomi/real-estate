import Property from "@/models/Property";
import { connectDB } from "@/lib/mongodb";
import { createAuditLog } from "@/lib/audit";
import { serialize } from "@/lib/serialize";

/**
 * دریافت لیست املاک با فیلتر و مرتب‌سازی
 * ✅ استفاده اجباری از .lean() برای بازگشت plain object
 */
export async function getProperties(filters = {}, sort = {}) {
  await connectDB();
  try {
    let query = { deletedAt: null };

    // فیلترها
    if (filters.propertyType) query.propertyType = filters.propertyType;
    if (filters.saleType) query.saleType = filters.saleType;
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }
    if (filters.minArea || filters.maxArea) {
      query.area = {};
      if (filters.minArea) query.area.$gte = Number(filters.minArea);
      if (filters.maxArea) query.area.$lte = Number(filters.maxArea);
    }
    if (filters.rooms) query.rooms = { $gte: Number(filters.rooms) };
    if (filters.address) query.address = { $regex: filters.address, $options: "i" };
    if (filters.direction) query.direction = filters.direction;
    if (filters.deedType) query.deedType = filters.deedType;
    if (filters.exchange === "true") query.exchange = true;

    // جستجو عمومی (q) روی نام مالک، شماره مالک یا آدرس
    if (filters.q) {
      const q = filters.q;
      query.$or = [
        { ownerName: { $regex: q, $options: "i" } },
        { ownerPhone: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
      ];
    }

    const amenities = [
      "parking", "elevator", "storage", "balcony", "furnished",
      "fireplace", "centralAntenna", "cabinet", "hood", "wardrobe"
    ];
    amenities.forEach((amenity) => {
      if (filters[amenity] === "true") query[amenity] = true;
    });

    // مرتب‌سازی
    let sortQuery = { createdAt: -1 };
    if (sort.field && sort.order) {
      sortQuery = { [sort.field]: sort.order === "asc" ? 1 : -1 };
    }

    let queryBuilder = Property.find(query)
      .sort(sortQuery);

    // امکان انتخاب فیلدها برای کاهش حجم پاسخ
    if (filters.fields) {
      const fields = String(filters.fields).split(",").map((f) => f.trim()).join(" ");
      queryBuilder = queryBuilder.select(fields);
    }

    queryBuilder = queryBuilder.lean(); // ✅ ضروری

    if (filters.limit) {
      queryBuilder = queryBuilder.limit(Number(filters.limit));
    }

    const res = await queryBuilder;
    return serialize(res);
  } catch (error) {
    throw error;
  }
}

/**
 * دریافت یک ملک با شناسه
 */
export async function getProperty(id) {
  await connectDB();
  try {
    const res = await Property.findById(id).lean(); // ✅
    return serialize(res);
  } catch (error) {
    throw error;
  }
}

/**
 * ایجاد ملک جدید
 */
export async function createProperty(data) {
  await connectDB();
  try {
    const property = await Property.create(data);
    const plainProperty = property.toObject();
    await createAuditLog({
      action: "CREATE",
      collection: "Property",
      documentId: property._id,
      changes: { after: plainProperty },
    });
    return serialize(plainProperty);
  } catch (error) {
    throw error;
  }
}

/**
 * ویرایش ملک
 */
export async function updateProperty(id, data) {
  await connectDB();
  try {
    const before = await Property.findById(id).lean(); // ✅
    if (!before) return null;

    data.updatedAt = Date.now();
    const updated = await Property.findByIdAndUpdate(id, data, {
      new: true,
    }).lean(); // ✅

    await createAuditLog({
      action: "UPDATE",
      collection: "Property",
      documentId: id,
      changes: { before, after: updated },
    });

    return serialize(updated);
  } catch (error) {
    throw error;
  }
}

/**
 * حذف ملک (نرم یا سخت)
 */
export async function deleteProperty(id, soft = true) {
  await connectDB();
  try {
    const property = await Property.findById(id).lean();
    if (!property) return null;

    if (soft) {
      const deleted = await Property.findByIdAndUpdate(
        id,
        { deletedAt: Date.now() },
        { new: true }
      ).lean(); // ✅
      await createAuditLog({
        action: "DELETE",
        collection: "Property",
        documentId: id,
        changes: { before: property },
      });
      return serialize(deleted);
    } else {
      await Property.findByIdAndDelete(id);
      await createAuditLog({
        action: "DELETE",
        collection: "Property",
        documentId: id,
        changes: { before: property },
      });
      return null;
    }
  } catch (error) {
    throw error;
  }
}