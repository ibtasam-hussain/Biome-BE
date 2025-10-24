const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
   firstName: {
       type: DataTypes.STRING,
       allowNull: false,
   },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    providerId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
email: {
  type: DataTypes.STRING(150),
  allowNull: false,
  unique: {
    name: "unique_email",   // <— fixed name for the index
  },
},
    password: {
        type: DataTypes.STRING,
    },
    profile : {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.ENUM("user", "admin", "superadmin"),
        defaultValue: "user",
    },
}, {
    timestamps: true, // adds createdAt and updatedAt automatically
});

module.exports = User;
