import ManageCategories from "@/components/modules/admin/category";
import CreateCategoryModal from "@/components/modules/admin/category/CreateCategoryModal";
import { getAllCategories } from "@/services/Category";

const ProductCategoryPage = async () => {
  const { data } = await getAllCategories();

  let content = null;

  if (data?.length > 0) {
    content = <ManageCategories categories={data} />;
  } else {
    content = <p>There are no Data</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Manage category </h1>
        <CreateCategoryModal />
      </div>
      {content}
    </div>
  );
};

export default ProductCategoryPage;
