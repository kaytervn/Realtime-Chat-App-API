import { formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";
import dayjs from "dayjs";

const formatDate = (val) => {
  return val ? dayjs(val).format("DD/MM/YYYY HH:mm:ss") : null;
};

const formatBirthDate = (val) => {
  return val ? dayjs(val).format("DD/MM/YYYY") : null;
};

const formatDistanceToNow = (val) => {
  return val
    ? formatDistanceToNowStrict(val, {
        addSuffix: true,
        locale: vi,
      })
    : null;
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

const addDistanceToNowGetters = (schema) => {
  schema.path("createdAt").get(formatDistanceToNow);
  schema.path("updatedAt").get(formatDistanceToNow);
};

export {
  formatDate,
  addDateGetters,
  schemaOptions,
  formatDistanceToNow,
  addDistanceToNowGetters,
  formatBirthDate,
};
