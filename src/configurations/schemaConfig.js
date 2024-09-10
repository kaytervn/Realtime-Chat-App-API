import dayjs from "dayjs";

const formatDate = (val) => {
  return val ? dayjs(val).format("DD/MM/YYYY HH:mm:ss") : null;
};

const schemaOptions = {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true },
};

const addDateGetters = (schema) => {
  schema.path("createdAt").get(formatDate);
  schema.path("updatedAt").get(formatDate);
};

export { formatDate, addDateGetters, schemaOptions };
