import React from "react";
import { Form, Input, Row, Col} from "antd";
import useBaseHook from "@src/hooks/BaseHook";

const UserDoneForm = ({
	form,
	isEdit,
	isTenant = false,
}: {
	form: any;
	isEdit: boolean;
	isTenant?: boolean;
}) => {
	const { t } = useBaseHook();
	
	return (
		<Row gutter={[24, 0]}>
			<Col md={12}>
				<Form.Item
					label={t("pages:users.form.lastName")}
					name="lastName"
					rules={[
						{
							required: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.lastName"),
							}),
						},
						{
							whitespace: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.lastName"),
							}),
						},
						{
							max: 255,
							message: t("messages:form.maxLength", {
								name: t("pages:users.form.lastName"),
								length: 255,
							}),
						},
					]}
				>
					<Input placeholder={t("pages:users.form.lastName")} />
				</Form.Item>
			</Col>

			<Col md={12}>
				<Form.Item
					label={t("pages:users.form.firstName")}
					name="firstName"
					rules={[
						{
							required: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.firstName"),
							}),
						},
						{
							whitespace: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.firstName"),
							}),
						},
						{
							max: 255,
							message: t("messages:form.maxLength", {
								name: t("pages:users.form.firstName"),
								length: 255,
							}),
						},
					]}
				>
					<Input placeholder={t("pages:users.form.firstName")} />
				</Form.Item>
			</Col>

			<Col md={12}>
				<Form.Item
					label={t("pages:users.form.phone")}
					name="phone"
					rules={[
						{
							required: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.phone"),
							}),
						},
						{
							whitespace: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.phone"),
							}),
						},
						{
							max: 255,
							message: t("messages:form.maxLength", {
								name: t("pages:users.form.phone"),
								length: 255,
							}),
						},
					]}
				>
					<Input placeholder={t("pages:users.form.phone")} />
				</Form.Item>
			</Col>

			<Col md={12}>
				<Form.Item
					label={t("pages:users.form.date_of_birth")}
					name="date_of_birth"
					rules={[
						{
							required: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.date_of_birth"),
							}),
						},
						{
							whitespace: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.date_of_birth"),
							}),
						},
						{
							max: 255,
							message: t("messages:form.maxLength", {
								name: t("pages:users.form.date_of_birth"),
								length: 255,
							}),
						},
					]}
				>
					<Input type="date" placeholder={t("pages:users.form.date_of_birth")} />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default UserDoneForm;
