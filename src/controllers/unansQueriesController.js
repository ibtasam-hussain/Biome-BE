const UnansweredQuery = require("../models/unansweredQuery");


// create UnansweredQuery
exports.createUnansweredQuery = async (req, res) => {
    try {
        const { message } = req.body;
        const query = await UnansweredQuery.create({ message });
        res.json({ message: "Query created successfully", query });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// get all UnansweredQueries with pagination
exports.getAllUnansweredQueries = async (req, res) => {
  try {
    // Ensure numeric values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    console.log({ page, limit, offset });

    // Only show open queries
    const queries = await UnansweredQuery.findAll({
      where: { status: "open" },
      offset,
      limit,
      order: [["id", "DESC"]],
    });

    res.json({ queries });
  } catch (err) {
    console.error("❌ Error in getAllUnansweredQueries:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// mark as closed
exports.markAsClosed = async (req, res) => {
    try {
        const { id } = req.params;
        const query = await UnansweredQuery.findByPk(id);
        if (!query) return res.status(404).json({ message: "Query not found" });
        query.status = "closed";
        await query.save();
        res.json({ message: "Query marked as closed" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
