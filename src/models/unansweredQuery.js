const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UnansweredQuery = sequelize.define(
    "UnansweredQuery",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        message: { type: DataTypes.TEXT, allowNull: false },
        status: { type: DataTypes.ENUM("open", "closed"), defaultValue: "open" },
    },
    {
        timestamps: true,
        tableName: "unanswered_queries",
    }
);

module.exports = UnansweredQuery;