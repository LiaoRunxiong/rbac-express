const { db } = require("../config/db");

module.exports = {
  register: async (body) => {
    const {
      user_id = "",
      username = "",
      phone = "",
      password = "",
      avatar_url = "",
      login_type = "",
    } = body;
    let query =
      "INSERT INTO user (user_id, username, phone, password,avatar_url, login_type) VALUES (?, ?, ?, ?, ?, ?)";
    const queryParams = [
      user_id,
      username,
      phone,
      password,
      avatar_url,
      login_type,
    ];
    let res = await db(query, queryParams);
    console.log("user:11:register", res);
    return res[0];
  },
  list: async (body) => {
    let sql = "select * from user where is_delete = 0";
    const queryParams = [];

    if (body.phone) {
      sql += " and phone = ?";
      queryParams.push(body.phone);
    }
    if (body.username) {
      sql += " and username = ?";
      queryParams.push(body.username);
    }
    if (body.user_id) {
      sql += " and user_id = ?";
      queryParams.push(body.user_id);
    }

    let res = await db(sql, queryParams);
    console.log("user:21:list", res[0]);
    return res[0];
  },
  login: async (body) => {
    // const { phone, password } = body;
    // let query =
    //   "SELECT * FROM user WHERE phone = ? and password = ? and is_delete = 0";
    // const queryParams = [phone, password];
    // let res = await db(query, queryParams);
    // return res[0];
  },
  selfMsg: async (user_id) => {
    let sql = "select * from user where user_id = ?";
    const queryParams = [user_id];
    let res = await db(sql, queryParams);
    return res[0];
  },
};
