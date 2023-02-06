import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button, Form, Col, Row } from "antd";
import userTempsService from "@root/src/services/userTempService";
import to from "await-to-js";
import useBaseHook from "@src/hooks/BaseHook";
import { LeftCircleFilled, SaveFilled } from "@ant-design/icons";
import UserDoneForm from "@root/src/components/Admin/Users/UserDoneForm";

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const CreateTemp = () => {
	const { t, notify, redirect, router } = useBaseHook();
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	//submit form
	const onFinish = async (values: any): Promise<void> => {
		setLoading(true);
		let { rePassword, ...otherValues } = values;
		let [error, result]: any[] = await to(
			userTempsService().withAuth().create(otherValues)
		);
		setLoading(false);
		if (error) return notify(t(`errors:${error.code}`), "", "error");
		notify(t("messages:message.recordUserCreated"));
		redirect("frontend.admin.users.createTemp");
		return result;
	};

	const randompass = () => {
		let result = "";
		let characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let charactersLength = characters.length;
		for (let i = 0; i < 8; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}
		return result;
	};

	return (
		<>
			<div className="content">
				<Form
					form={form}
					name="createAdmin"
					layout="vertical"
					initialValues={{
						username: "",
						password: randompass(),
						email: "",
						groupId: undefined,
						tags: [],
					}}
					onFinish={onFinish}
					scrollToFirstError
				>
					<Row>
						<Col md={{ span: 16, offset: 4 }}>
							<UserDoneForm form={form} isEdit={false} />
							<Form.Item
								wrapperCol={{ span: 24 }}
								className="text-center"
							>
								<Button
									onClick={() => router.back()}
									className="btn-margin-right"
								>
									<LeftCircleFilled /> {t("buttons:back")}
								</Button>
								<Button
									type="primary"
									htmlType="submit"
									loading={loading}
									className="btn-margin-right"
								>
									<SaveFilled /> {t("buttons:submit")}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
		</>
	);
};

CreateTemp.Layout = (props) => {
	const { t } = useBaseHook();
	return (
		<Layout
			title={t("pages:users.create.title")}
			description={t("pages:users.create.description")}
			{...props}
		/>
	);
};

CreateTemp.permissions = {
	users: "C",
};

export default CreateTemp;
