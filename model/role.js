const { db, pool } = require("../config/db");
var createError = require("http-errors");

module.exports = {
  add: async function (body) {
    const { role_id = "", role_name = "" } = body;
    let query = "INSERT INTO role (role_id, role_name) VALUES (?, ?)";
    const queryParams = [role_id, role_name];
    let res = await db(query, queryParams);
    console.log("role:9:add", res);
    return res[0];
  },
  edit: async function (body) {
    const { role_id = "", role_name = "", open = 1 } = body;
    console.log(15, this);
    try {
      //   await db("SET autocommit = 0");
      let query = "START TRANSACTION";
      await db(query);
      console.log(19, this);
      let record = await this.list({ role_id });
      if (record.length < 1) {
        throw createError(400, "该角色不存在");
      }
      query =
        "update role set role_name = ?, open = ? where role_id = ? and is_delete = 0";
      let queryParams = [role_name, open, role_id];
      await db(query, queryParams);
      query =
        "update user_role set is_delete = 1 where role_id = ? and is_delete = 0";
      queryParams = [role_id];
      await db(query, queryParams);
      // 提交事务
      let res = await db("COMMIT");
      console.log(35, res);
    } catch (error) {
      console.log(34, error);
      // 回滚事务
      await db("ROLLBACK");
      throw error;
    }
  },
  delete: async function (body) {
    const { role_id = "" } = body;
    try {
      //   await db("SET autocommit = 0");
      let query = "START TRANSACTION";
      await db(query);
      query = "update role set is_delete = 1 where role_id = ?";
      let queryParams = [role_id];
      await db(query, queryParams);
      query =
        "update user_role set is_delete = 1 where role_id = ? and is_delete = 0";
      queryParams = [role_id];
      await db(query, queryParams);
      // 提交事务
      let res = await db("COMMIT");
      console.log(35, res);
    } catch (error) {
      console.log(34, error);
      // 回滚事务
      await db("ROLLBACK");
      throw error;
    }
  },
  list: async (body) => {
    let sql = "select * from role where is_delete = 0";
    const queryParams = [];

    if (body.role_id) {
      sql += " and role_id = ?";
      queryParams.push(body.role_id);
    }
    if (body.role_name) {
      sql += " and role_name = ?";
      queryParams.push(body.role_name);
    }
    if (body.open) {
      sql += " and open = ?";
      queryParams.push(body.open);
    }

    let res = await db(sql, queryParams);
    console.log("role:21:list", res[0]);
    return res[0];
  },
};
