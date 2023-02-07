import BaseController from "./BaseController";
import UserModel from "@root/server/app/Models/UserModel";
import RoleModel from "@app/Models/RoleModel";
import ApiException from "@app/Exceptions/ApiException";
import authConfig from "@config/auth";
import TenantsModel from "@app/Models/TenantsModel";
import Logger from "@core/Logger";
import to from "await-to-js";
import Auth from "@root/server/libs/Auth";
const logger = Logger("User");

export default class AdminController extends BaseController {
	Model: typeof UserModel = UserModel;
	RoleModel: any = RoleModel;
	TenantsModel: any = TenantsModel;

	async index() {
		const { auth } = this.request;
		let inputs = this.request.all();
		let project = [
			"users.username",
			"users.firstName",
			"users.lastName",
			"users.email",
			"users.roleId",
			"users.code",
			"users.id",
			"tenants.name as tenantName",
			"roles.name as roleName",
			"users.createdAt",
			"ag.username as agUsername",
		];
		// let getAccountsItCreated = await this.Model.getAccountsItCreated(auth.id)
		let tenantId = await this.Model.getTenantId(auth.id);
		// let getAccountsItCreatedId = getAccountsItCreated.map(item => item.id)

		let role = await this.RoleModel.getById(auth.roleId);
		let query = this.Model.query()
			.leftJoin("users as ag", "users.createdBy", "ag.id")
			.leftJoin("roles", "users.roleId", "roles.id")
			.leftJoin("tenants", "users.tenantId", "tenants.id")
			.whereNot("users.id", auth.id);

		if (role.key != "root") {
			query = query
				.where("users.tenantId", tenantId)
				.whereNot("roles.key", "root");
			// .whereIn('users.id',getAccountsItCreatedId)
		}

		let result = await query.select(project).getForGridTable(inputs);
		return result;
	}

	async detail() {
		const { auth } = this.request;
		const allowFields = {
			id: "string!",
		};
		let inputs = this.request.all();
		let user = await this.Model.query().where("id", auth.id).first();
		logger.info(`View Detail [usernameView:${user.username}] `);
		let params = this.validate(inputs, allowFields, {
			removeNotAllow: true,
		});
		let result = await this.Model.getOne({ code: params.id });
		if (!result) {
			logger.error(`Critical:Show detail user ERR: user doesn't exist!`);
			throw new ApiException(6000, "user doesn't exist!");
		}
		logger.info(
			`Show detail user [usernameView:${
				user.username
			},username:${JSON.stringify(result)}] `
		);
		delete result["password"];
		delete result["twofaKey"];
		delete result["isFirst"];
		delete result["twofa"];
		return result;
	}

	async store() {
		let inputs = this.request.all();
		console.log(
			"🚀 ~ file: UserController.ts:83 ~ AdminController ~ store ~ inputs",
			inputs
		);

		// let [error, auth] = await to(
		// 	Auth.verify(params.token, {
		// 		key: authConfig["SECRET_KEY_ADMIN"],
		// 	})
		// );
		// let TokenInRedis;
		// if (error) {
		// 	logger.error(
		// 		`Critical:Check reset Password ERR: The token has expired`
		// 	);
		// 	logger.error(`Critical:Check reset Password ERR: ${error}`);
		// 	throw new ApiException(6012, "The token has expired");
		// }
		// await redis.get(`ForgotPassword:${auth.id}`).then((res) => {
		// 	TokenInRedis = res;
		// });
		// if (TokenInRedis != params.token)
		// 	throw new ApiException(7004, "Please use the latest link");
		// let user = await this.Model.getById(auth.id);
		// if (!user) throw new ApiException(6006, "User doesn't exist!");

		// let hash = await this.Model.hash(params.newPassword);
		// let twofaKey = makeKey(32);
		// do {
		// 	twofaKey = makeKey(32);
		// } while (!!(await this.Model.getOne({ twofaKey: twofaKey })));
		// logger.info(`Reset Password [username:${user.usermane}] `);
		// let result = await this.Model.updateOne(user.id, {
		// 	password: hash,
		// 	isFirst: 1,
		// 	twofaKey: twofaKey,
		// });
		return inputs;
	}

	async update() {
		let inputs = this.request.all();
		const { auth } = this.request;
		const allowFields = {
			id: "number!",
			firstName: "string!",
			lastName: "string!",
			email: "string!",
			twofa: "boolean",
		};
		let user = await this.Model.getById(auth.id);
		logger.info(`Update user [username:${user.username}] `);
		let params = this.validate(inputs, allowFields, {
			removeNotAllow: true,
		});
		let twoFa =
			typeof params.twofa === "undefined" ? 1 : params.twofa ? 1 : 0;
		const { id } = params;
		delete params.id;

		let exist = await this.Model.getById(id);
		if (!exist) {
			logger.error(`Critical:User updated ERR: User doesn't exists!`);
			throw new ApiException(6006, "User doesn't exists!");
		}

		let emailExist = await this.Model.getOne({ email: params.email });
		if (emailExist && emailExist.id !== exist.id) {
			logger.error(`Critical:User updated ERR: Email already exists! `);
			throw new ApiException(6021, "Email already exists!");
		}

		let dataUpdate = {
			...params,
			twofa: twoFa,
		};

		let result = await this.Model.updateOne(id, { ...dataUpdate });
		logger.info(
			`Update user [username:${user.username},userUpdate:${JSON.stringify(
				result
			)}] `
		);
		delete result["password"];
		delete result["twofaKey"];
		delete result["isFirst"];
		delete result["twofa"];
		return {
			result,
			old: exist,
		};
	}

	async destroy() {
		const { auth } = this.request;
		let params = this.request.all();
		let id = params.id;
		if (!id) throw new ApiException(9996, "ID is required!");

		let exist = await this.Model.getById(id);
		if (!exist) {
			logger.error(`Critical:User destroy ERR: User doesn't exists!`);
			throw new ApiException(6006, "User doesn't exists!");
		}
		if ([id].includes(auth.id))
			throw new ApiException(6022, "You can not remove your account.");

		let user = await this.Model.query().where("id", params.id).first();
		await user.$query().delete();
		let userAuth = await this.Model.getById(auth.id);
		logger.info(
			`Destroy user [username:${
				userAuth.username
			},userDelete:${JSON.stringify(user)}] `
		);
		return {
			message: `Delete successfully`,
			old: user,
		};
	}

	async delete() {
		const { auth } = this.request;
		const allowFields = {
			ids: ["number!"],
		};
		const inputs = this.request.all();
		let params = this.validate(inputs, allowFields);

		let exist = await this.Model.query().whereIn("id", params.ids);
		if (!exist || exist.length !== params.ids.length) {
			logger.error(`Critical:User delete ERR: User doesn't exists!`);
			throw new ApiException(6006, "User doesn't exists!");
		}
		if (params.ids.includes(auth.id)) {
			logger.error(
				`Critical:User delete ERR: You can not remove your account!`
			);
			throw new ApiException(6022, "You can not remove your account.");
		}

		let users = await this.Model.query().whereIn("id", params.ids);
		for (let user of users) {
			await user.$query().delete();
		}
		let userAuth = await this.Model.getById(auth.id);
		logger.info(
			`Detele user [username:${
				userAuth.username
			},listUserDelete:${JSON.stringify(users)}] `
		);
		return {
			old: {
				usernames: (users || [])
					.map((user) => user.username)
					.join(", "),
			},
		};
	}

	async getInfo() {
		const { auth } = this.request;
		let result = await this.Model.getById(auth.id);
		logger.info(`Show info [username:${result.username}] `);
		delete result["password"];
		delete result["twofaKey"];
		delete result["isFirst"];
		if (!result) {
			logger.error(`Critical:User getInfo ERR: User doesn't exist!`);
			throw new ApiException(6006, "User doesn't exist!");
		}

		return result;
	}

	async userCheckToken() {
		const { token } = this.request;
		let [error, auth] = await to(
			Auth.verify(token, {
				key: authConfig["SECRET_KEY_ADMIN"],
			})
		);

		if (error) {
			logger.error(
				`Critical:Check user confirm ERR: The token has expired`
			);
			logger.error(`Critical:Check user confirm ERR: ${error}`);
			throw new ApiException(6012, "The token has expired");
		}

		return auth;
	}
}
