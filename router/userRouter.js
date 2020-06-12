const express = require("express");
const router = express.Router();
const db = require("../model/db");

router.get("/", async (req, res) => {
  res.render("user");
});

router.post("/create", async (req, res) => {
  const { user_name, user_phone } = req.body;
  await db.users.create({ user_nmae: user_name, user_phone: user_phone });
  res.send({ status: 200, message: "success" });
});

router.get("/list", async (req, res) => {
  const result = await db.users.findAll();
  const resultDetail = await db.users.findOne({ where: { id: 1 } });
  const resultQuery = await db.sequelize.query(
    `select * from users order by Id`
  );
  res.send({
    status: 200,
    data: {
      result,
      resultDetail,
    },
  });
});

router.put("/update", async (req, res) => {
  await db.users.update(
    {
      user_name: `gunheekim`,
    },
    { where: { id: 1 } }
  );
});
module.exports = router;
