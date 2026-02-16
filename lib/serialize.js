function isObjectId(val) {
  return (
    val && typeof val === "object" &&
    (val._bsontype === "ObjectID" || val.constructor?.name === "ObjectID" || val.constructor?.name === "ObjectId")
  );
}

function serializeValue(val) {
  if (val == null) return val;
  if (isObjectId(val)) return val.toString();
  if (val instanceof Date) return val.toISOString();
  if (Array.isArray(val)) return val.map(serializeValue);
  if (typeof val === "object") return serializeObject(val);
  return val;
}

function serializeObject(obj) {
  const out = {};
  for (const key of Object.keys(obj)) {
    try {
      out[key] = serializeValue(obj[key]);
    } catch (e) {
      out[key] = obj[key];
    }
  }
  return out;
}

export function serialize(doc) {
  if (doc == null) return doc;
  if (Array.isArray(doc)) return doc.map(serialize);
  if (typeof doc !== "object") return doc;
  return serializeObject(doc);
}

export default serialize;
