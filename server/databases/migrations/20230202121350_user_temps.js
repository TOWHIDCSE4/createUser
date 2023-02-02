/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("user_temps", function (table) {
		table.increments();
		table.string("username").nullable();
		table.string("email").nullable();
		table.string("password").nullable();
		table.integer("roleId").nullable();
		table.integer("tenantId").nullable();
		table.timestamp("createdAt").defaultTo(knex.fn.now());
		table.timestamp("updatedAt").defaultTo(knex.fn.now());
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable("user_temps");
};
