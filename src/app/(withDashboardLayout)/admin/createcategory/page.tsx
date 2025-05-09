import ManageCategories from "@/components/modules/admin/category";
import { getAllCategories } from "@/services/Category";

const ProductCategoryPage = async () => {
  const { data } = await getAllCategories();


  let content = null;

  if (data?.length > 0) {
    content = <ManageCategories categories={data} />;
  } else {
    content = <p>There are no Data</p>;
  }

  return <div>{content}</div>;
};

export default ProductCategoryPage;

