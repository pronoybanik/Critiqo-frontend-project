"use client";

import React, { useState } from "react";
import CreateCategoryModal from "./CreateCategoryModal";
// import { ICategory } from "@/types";
// import { NMTable } from "@/components/ui/core/NMTable";
// import { ColumnDef } from "@tanstack/react-table";
// import { Trash } from "lucide-react";
// import Image from "next/image";
import { deleteCategory } from "@/services/Category";
import { toast } from "sonner";
import DeleteConfirmationModal from "@/components/ui/core/NMModal/DeleteConfirmationModal";
import { NMTable } from "@/components/ui/core/NMTable";
import { ICategory } from "@/types/category";
import { Trash } from "lucide-react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
// import DeleteConfirmationModal from "@/components/ui/core/NMModal/DeleteConfirmationModal";

type TCategoriesProps = {
  categories: ICategory[];
};

const ManageCategories = ({ categories }: TCategoriesProps) => {
  console.log("category", categories);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleDelete = (data: ICategory) => {
    console.log(data);
    setSelectedId(data?._id);
    setSelectedItem(data?.name);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedId) {
        const res = await deleteCategory(selectedId);
        console.log(res);
        if (res.success) {
          toast.success(res.message);
          setModalOpen(false);
        } else {
          toast.error(res.message);
        }
      }
    } catch (err: any) {
      console.error(err?.message);
    }
  };


  const columns: ColumnDef<ICategory>[] = [
    {
      accessorKey: "name",
      header: () => <div>Category Name</div>,
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Image
            src={row.original.icon}
            alt={row.original.name}
            width={40}
            height={40}
            className="w-8 h-8 rounded-full"
          />
          <span className="truncate">{row.original.name}</span>
        </div>
      ),
    },
   
    
    {
      accessorKey: "action",
      header: () => <div>Action</div>,
      cell: ({ row }) => (
        <button
          className="text-red-500"
          title="Delete"
          onClick={() => handleDelete(row.original)}
        >
          <Trash className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Manage category </h1>
        <CreateCategoryModal />
      </div>
      {/* <NMTable data={categories} columns={columns} /> */}
      <DeleteConfirmationModal
        name={selectedItem}
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ManageCategories;
