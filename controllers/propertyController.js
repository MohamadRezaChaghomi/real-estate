import Property from "@/models/Property";
import { connectDB } from "@/lib/mongodb";
import { createAuditLog } from "@/lib/audit";

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
      .sort(sortQuery)
      .lean(); // ✅ ضروری

    if (filters.limit) {
      queryBuilder = queryBuilder.limit(Number(filters.limit));
    }

    return await queryBuilder;
  } catch (error) {
    console.error("خطا در getProperties:", error);
    throw error;
  }
}

/**
 * دریافت یک ملک با شناسه
 */
export async function getProperty(id) {
  await connectDB();
  try {
    return await Property.findById(id).lean(); // ✅
  } catch (error) {
    console.error("خطا در getProperty:", error);
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
    const plainProperty = property.toObject(); // ✅ تبدیل به plain object
    await createAuditLog({
      action: "CREATE",
      collection: "Property",
      documentId: property._id,
      changes: { after: plainProperty },
    });
    return plainProperty;
  } catch (error) {
    console.error("خطا در createProperty:", error);
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

    return updated;
  } catch (error) {
    console.error("خطا در updateProperty:", error);
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
      return deleted;
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
    console.error("خطا در deleteProperty:", error);
    throw error;
  }
}