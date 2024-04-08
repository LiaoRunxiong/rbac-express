const userModel = require("../model/user");
const roleModel = require("../model/role");
var createError = require("http-errors");
const { v4: uuidv4 } = require("uuid"); // Import the uuid package
const axios = require("axios");
module.exports = {
  list: async (req, res, next) => {
    try {
      const { role_name } = req.body;
      // Validate phone number format
      if (!role_name) {
        throw createError(400, "角色名不能为空");
      }
      if (role_name.length > 36) {
        throw createError(400, "角色名长度超过限制");
      }
      const record = await roleModel.list({ role_name });
      if (record.length > 0) {
        throw createError(400, "角色已存在");
      }
      const role_id = uuidv4();
      await roleModel.add({ ...req.body, role_id });
      res.status(200).send({
        code: 200,
        msg: "添加成功",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
  add: async (req, res, next) => {
    try {
      const { role_name } = req.body;
      // Validate phone number format
      if (!role_name) {
        throw createError(400, "角色名不能为空");
      }
      if (role_name.length > 36) {
        throw createError(400, "角色名长度超过限制");
      }
      const record = await roleModel.list({ role_name });
      if (record.length > 0) {
        throw createError(400, "角色已存在");
      }
      const role_id = uuidv4();
      await roleModel.add({ ...req.body, role_id });
      res.status(200).send({
        code: 200,
        msg: "添加成功",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
  edit: async (req, res, next) => {
    try {
      const { role_id, role_name } = req.body;
      // Validate phone number format
      if (!role_id) {
        throw createError(500);
      }
      if (!role_name) {
        throw createError(400, "角色名不能为空");
      }
      if (role_name.length > 36) {
        throw createError(400, "角色名长度超过限制");
      }
      await roleModel.edit({ ...req.body });
      res.status(200).send({
        code: 200,
        msg: "修改成功",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { role_id } = req.body;
      // Validate phone number format
      if (!role_id) {
        throw createError(500);
      }

      await roleModel.delete({ ...req.body });
      res.status(200).send({
        code: 200,
        msg: "删除成功",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
