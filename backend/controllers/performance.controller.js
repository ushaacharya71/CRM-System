import Revenue from "../models/Revenue.js";
import User from "../models/User.js";

export const getTopPerformers = async (req, res) => {
  try {
    const { type } = req.query;

    let startDate;
    let endDate;
    let limit;

    const now = new Date();

    /* ================= DAILY ================= */
    if (type === "daily") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // today start

      endDate = new Date();
      endDate.setHours(23, 59, 59, 999); // today end

      limit = 3;
    }

    /* ================= WEEKLY ================= */
    else if (type === "weekly") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      limit = 3;
    }

    /* ================= MONTHLY ================= */
    else if (type === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);

      limit = 5;
    }

    else {
      return res.status(400).json({ message: "Invalid type" });
    }

    const result = await Revenue.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$user",
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          role: "$user.role",
          totalRevenue: 1,
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    console.error("❌ Top performers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
