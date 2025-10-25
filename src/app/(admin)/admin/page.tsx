import { redirect } from "next/navigation";

const AdminIndexPage = async () => {
  redirect("/admin/dashboard");
};

export default AdminIndexPage;
