"use client";
import { useEffect, useState, memo } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiLoader, FiImage } from "react-icons/fi";
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: () => void;
  t: (key: string) => string;
}

const ProductsStudio = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const { t, language } = useLanguage();

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products", {
        cache: 'no-store'
      });
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(t('products.fetchError'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setNewImages([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploadingImages(true);
      const files = Array.from(e.target.files);
      setNewImages(files);

      // Create previews for new images
      const previews = files.map(file => URL.createObjectURL(file));
      setNewImagePreviews(previews);
      setIsUploadingImages(false);
    }
  };

  const handleRemoveImage = (image: string) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: editingProduct.images.filter((img) => img !== image),
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append("_id", editingProduct._id);
      formData.append("name", editingProduct.name);
      formData.append("description", editingProduct.description);
      formData.append("price", editingProduct.price.toString());
      editingProduct.images.forEach((img) => formData.append("existingImages", img));
      newImages.forEach((file) => formData.append("newImages", file));

      const updatePromise = axios.put("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.promise(updatePromise, {
        loading: t('common.updating'),
        success: () => {
          setEditingProduct(null);
          return t('productsStudio.updateSuccess');
        },
        error: t('productsStudio.updateError')
      });

      try {
        const response = await updatePromise;
        const updatedProduct = response.data.product;
        setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
      } catch (error) {
        console.error("Error updating product:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    setIsDeleting(true);
    const deletePromise = axios.delete('/api/products', {
      data: { _id: deletingProduct._id }
    });

    toast.promise(deletePromise, {
      loading: t('common.deleting'),
      success: () => {
        setDeletingProduct(null);
        setProducts(products.filter((p) => p._id !== deletingProduct._id));
        return t('productsStudio.deleteSuccess');
      },
      error: t('productsStudio.deleteError')
    });

    try {
      await deletePromise;
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Cleanup previews when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      newImagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [newImagePreviews]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-lg">
      {t('common.loading')}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('productsStudio.title')}</h1>
        <p className="mt-2 text-gray-600">{t('productsStudio.description')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={handleEdit}
            onDelete={() => setDeletingProduct(product)}
            t={t}
          />
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => {
        setEditingProduct(null);
        setNewImagePreviews([]);
        setNewImages([]);
      }}>
        <DialogContent className="sm:max-w-xl max-h-[95vh]  overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {t('productsStudio.editTitle')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-6  ">
            <div className="space-y-4 ">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('productsStudio.productName')}
                </label>
                <input
                  type="text"
                  value={editingProduct?.name || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('productsStudio.productDescription')}
                </label>
                <textarea
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                  value={editingProduct?.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('productsStudio.productPrice')}
                </label>
                <input
                  type="number"
                  value={editingProduct?.price || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('productsStudio.currentImages')}
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {editingProduct?.images.map((img) => (
                    <div key={img} className="relative group">
                      <Image
                        src={img}
                        alt="Product"
                        width={100}
                        height={100}
                        className="rounded-lg object-cover w-full h-24"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('productsStudio.addNewImages')}
                </label>
                <div className="mt-1 flex flex-col space-y-4">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors duration-200">
                    <div className="space-y-2 text-center">
                      <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>{t('productsStudio.chooseImages')}</span>
                          <input
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            className="sr-only"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {newImagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                      {newImagePreviews.map((preview, index) => (
                        <div key={preview} className="relative group">
                          <Image
                            src={preview}
                            alt="Preview"
                            width={100}
                            height={100}
                            className="rounded-lg object-cover w-full h-24"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
                              setNewImages(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {isUploadingImages && (
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <FiLoader className="animate-spin mr-2" />
                      {t('common.uploading')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUpdating ? t('common.updating') : t('common.update')}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {t('productsStudio.deleteTitle')}
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">{t('productsStudio.deleteConfirm')}</p>
          <DialogFooter>
            <div className="flex justify-end space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                onClick={() => setDeletingProduct(null)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? t('common.deleting') : t('common.delete')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProductCard = memo(({ product, onEdit, onDelete, t }: ProductCardProps) => {
  const { language } = useLanguage();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="relative aspect-square">
        {product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <FiImage className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-blue-600 font-bold mt-1">
          {product.price.toFixed(2)}
          {language === 'ar' ? ' دج' : ' DA'}
        </p>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => onEdit(product)}
            variant="outline"
            className="flex-1"
          >
            <FiEdit2 className="w-4 h-4 mr-2" />
            {t('productsStudio.edit')}
          </Button>
          <Button
            onClick={() => onDelete()}
            variant="destructive"
            className="flex-1"
          >
            <FiTrash2 className="w-4 h-4 mr-2" />
            {t('productsStudio.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ProductsStudio;
