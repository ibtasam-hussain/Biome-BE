// src/models/message.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Dialect-aware JSON type
const dialect = sequelize.getDialect();
// Postgres => JSONB, MySQL/MariaDB/MSSQL => JSON, SQLite/older => TEXT fallback
const useText = ["sqlite"].includes(dialect);
const JSONType =
  dialect === "postgres" ? DataTypes.JSONB :
  useText ? DataTypes.TEXT : DataTypes.JSON;

const Message = sequelize.define("Message", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  chatId: { type: DataTypes.INTEGER, allowNull: false },
  sender: { type: DataTypes.ENUM("user", "ai"), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },

  // NEW: store full AI payload (ans/source/where_to_find/tools/timestamps/query/success/error)
  meta: {
    type: JSONType,
    allowNull: true,
    // If DB doesn't support native JSON, store as TEXT (stringify/parse)
    ...(useText && {
      get() {
        const raw = this.getDataValue("meta");
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
      },
      set(val) {
        this.setDataValue("meta", val ? JSON.stringify(val) : null);
      },
    }),
  },
}, {
  timestamps: true,
  tableName: "messages",
  indexes: [
    { fields: ["chatId", "createdAt"] },
    { fields: ["chatId"] },
  ],
});

module.exports = Message;
