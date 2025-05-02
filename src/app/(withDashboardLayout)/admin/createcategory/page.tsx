import ManageCategories from "@/components/modules/admin/category";
import { getAllCategories } from "@/services/Category";

const ProductCategoryPage = async () => {
  const { data } = await getAllCategories();
  

  return (
    <div>
      <ManageCategories categories={data} />
    </div>
  );
};

export default ProductCategoryPage;
