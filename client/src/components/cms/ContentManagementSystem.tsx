import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Edit3, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  RotateCcw,
  Monitor,
  Settings,
  Package,
  Globe,
  X,
  FileText,
  Clock,
  ArrowLeft
} from "lucide-react";

interface CarouselSlide {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WebsiteContent {
  id: number;
  section: string;
  key: string;
  value: string;
  type: string;
  updatedAt: string;
}

interface ContentFormData {
  section: string;
  key: string;
  value: string;
  type: string;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category: string;
  price: string;
  stockQuantity: number;
  minStockLevel: number;
  imageUrl?: string;
  specifications?: string;
  status: string;
  isWholesale: boolean;
  wholeSalePrice?: string;
  supplierInfo?: any;
  createdAt: string;
  updatedAt: string;
}

interface ContentManagementSystemProps {
  onBack?: () => void;
}

export default function ContentManagementSystem({ onBack }: ContentManagementSystemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("carousel");

  // Carousel Management
  const { data: carouselData, isLoading: carouselLoading } = useQuery({
    queryKey: ["/api/carousel-slides"],
  });
  const carouselSlides = (carouselData as any)?.slides || [];

  // Website Content Management
  const { data: websiteContentData, isLoading: contentLoading } = useQuery({
    queryKey: ["/api/website-content"],
  });
  const websiteContent = (websiteContentData as any)?.content || [];

  // Product Management
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/admin/products"],
  });
  const products = (productsData as any)?.products || [];

  // Carousel Slide Form State
  const [slideForm, setSlideForm] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    order: 0,
    isActive: true
  });
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    sku: "",
    name: "",
    description: "",
    category: "",
    price: "",
    stockQuantity: 0,
    minStockLevel: 10,
    imageUrl: "",
    specifications: "",
    status: "active",
    isWholesale: false,
    wholeSalePrice: "",
    supplierInfo: ""
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // Website Content Form State
  const [contentForm, setContentForm] = useState<ContentFormData>({
    section: "",
    key: "",
    value: "",
    type: "text"
  });
  const [editingContentId, setEditingContentId] = useState<number | null>(null);

  // Mutations for Carousel
  const createSlideMutation = useMutation({
    mutationFn: (slideData: any) => apiRequest("POST", "/api/carousel-slides", slideData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/carousel-slides"] });
      resetSlideForm();
      toast({ title: "Carousel slide created successfully!" });
    },
    onError: () => {
      toast({ title: "Error creating slide", variant: "destructive" });
    }
  });

  const updateSlideMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/carousel-slides/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/carousel-slides"] });
      resetSlideForm();
      toast({ title: "Carousel slide updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error updating slide", variant: "destructive" });
    }
  });

  const deleteSlideMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/carousel-slides/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/carousel-slides"] });
      toast({ title: "Carousel slide deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error deleting slide", variant: "destructive" });
    }
  });

  // Mutations for Products
  const createProductMutation = useMutation({
    mutationFn: (productData: any) => apiRequest("POST", "/api/admin/products", productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      resetProductForm();
      toast({ title: "Product created successfully!" });
    },
    onError: () => {
      toast({ title: "Error creating product", variant: "destructive" });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/admin/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      resetProductForm();
      toast({ title: "Product updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error updating product", variant: "destructive" });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({ title: "Product deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error deleting product", variant: "destructive" });
    }
  });

  // Mutations for Website Content
  const updateWebsiteContentMutation = useMutation({
    mutationFn: (contentData: ContentFormData) => apiRequest("PUT", "/api/website-content", contentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/website-content"] });
      resetContentForm();
      toast({ title: "Website content updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error updating content", variant: "destructive" });
    }
  });

  // Form helpers
  const resetSlideForm = () => {
    setSlideForm({
      title: "",
      subtitle: "",
      imageUrl: "",
      order: 0,
      isActive: true
    });
    setEditingSlideId(null);
  };

  const resetProductForm = () => {
    setProductForm({
      sku: "",
      name: "",
      description: "",
      category: "",
      price: "",
      stockQuantity: 0,
      minStockLevel: 10,
      imageUrl: "",
      specifications: "",
      status: "active",
      isWholesale: false,
      wholeSalePrice: "",
      supplierInfo: ""
    });
    setEditingProductId(null);
  };

  const resetContentForm = () => {
    setContentForm({
      section: "",
      key: "",
      value: "",
      type: "text"
    });
    setEditingContentId(null);
  };

  const handleSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlideId) {
      updateSlideMutation.mutate({ id: editingSlideId, ...slideForm });
    } else {
      createSlideMutation.mutate(slideForm);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      updateProductMutation.mutate({ id: editingProductId, ...productForm });
    } else {
      createProductMutation.mutate(productForm);
    }
  };

  const handleContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContentMutation.mutate(contentForm);
  };

  const editSlide = (slide: CarouselSlide) => {
    console.log('editSlide called with:', slide);
    console.log('Setting slideForm to:', {
      title: slide.title,
      subtitle: slide.subtitle || "",
      imageUrl: slide.imageUrl,
      order: slide.order,
      isActive: slide.isActive
    });
    
    setSlideForm({
      title: slide.title,
      subtitle: slide.subtitle || "",
      imageUrl: slide.imageUrl,
      order: slide.order,
      isActive: slide.isActive
    });
    setEditingSlideId(slide.id);
    
    // Force a re-render and scroll
    setTimeout(() => {
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        formElement.style.border = '3px solid #22c55e';
        formElement.style.backgroundColor = '#f0fdf4';
        setTimeout(() => {
          formElement.style.border = '';
          formElement.style.backgroundColor = '';
        }, 3000);
      }
    }, 100);
    
    toast({
      title: "Form Updated",
      description: `Editing: ${slide.title} - Check the form above!`,
    });
  };

  const editProduct = (product: Product) => {
    setProductForm({
      sku: product.sku,
      name: product.name,
      description: product.description || "",
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
      minStockLevel: product.minStockLevel,
      imageUrl: product.imageUrl || "",
      specifications: product.specifications || "",
      status: product.status,
      isWholesale: product.isWholesale,
      wholeSalePrice: product.wholeSalePrice || "",
      supplierInfo: product.supplierInfo || ""
    });
    setEditingProductId(product.id);
  };

  const editContent = (content: WebsiteContent) => {
    setContentForm({
      section: content.section,
      key: content.key,
      value: content.value,
      type: content.type
    });
    setEditingContentId(content.id);
    setActiveTab("content");
    toast({
      title: "Content Edit Mode",
      description: `Editing ${content.section} - ${content.key}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          )}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-green-800">Content Management System</h2>
            <p className="text-muted-foreground">Complete control over your TGM platform content</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="h-6 w-6 text-green-600" />
          <Badge variant="outline" className="text-green-600 border-green-600">Website Control</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="carousel" className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4" />
            <span>Header Carousel</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Product Catalog</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Site Content</span>
          </TabsTrigger>
        </TabsList>

        {/* Carousel Management */}
        <TabsContent value="carousel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Homepage Header Carousel</span>
              </CardTitle>
              <CardDescription>
                Manage the product carousel that appears at the top of your TGM storefront
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSlideSubmit} className="space-y-4 p-6 bg-gray-50 rounded-lg border-4 border-blue-500" style={{backgroundColor: editingSlideId ? '#e0f2fe' : '#f9fafb'}}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editingSlideId && (
                    <div className="md:col-span-2 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
                      <h3 className="text-lg font-bold text-green-800">✅ EDITING MODE ACTIVE</h3>
                      <p className="text-green-700">Currently editing slide #{editingSlideId}</p>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="slideTitle">Slide Title *</Label>
                    <Input
                      id="slideTitle"
                      value={slideForm.title}
                      onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                      placeholder="e.g., Premium Rice"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slideSubtitle">Subtitle</Label>
                    <Input
                      id="slideSubtitle"
                      value={slideForm.subtitle}
                      onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                      placeholder="e.g., High quality imported rice"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slideImage">Product Image URL *</Label>
                    <div className="space-y-2">
                      <Input
                        id="slideImage"
                        value={slideForm.imageUrl}
                        onChange={(e) => setSlideForm({ ...slideForm, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=400&fit=crop"
                        required
                      />
                      {slideForm.imageUrl && (
                        <div className="p-2 border rounded bg-gray-50">
                          <p className="text-xs text-gray-600 mb-2">Preview:</p>
                          <img 
                            src={slideForm.imageUrl} 
                            alt="Preview" 
                            className="w-full h-20 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 space-y-2">
                      <p>Upload your own image or choose from library:</p>
                      
                      {/* File Upload Section */}
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Label className="text-sm font-medium text-green-800">Upload Image from Computer:</Label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="imageUpload"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  toast({
                                    title: "File Too Large",
                                    description: "Please select an image under 5MB",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const dataUrl = event.target?.result as string;
                                  setSlideForm({ ...slideForm, imageUrl: dataUrl });
                                  toast({
                                    title: "Image Uploaded",
                                    description: "Your image has been loaded. Click 'Update Slide' to save!",
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => document.getElementById('imageUpload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Image File (JPG, PNG, GIF)
                          </Button>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          Select images from your computer - Max size: 5MB
                        </p>
                      </div>

                      {/* Custom Image URL Input */}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Label className="text-sm font-medium text-blue-800">Or Use Image URL:</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder="Paste image URL here (https://...)"
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const url = e.currentTarget.value.trim();
                                if (url) {
                                  setSlideForm({ ...slideForm, imageUrl: url });
                                  toast({
                                    title: "Custom Image Added",
                                    description: "Your image URL has been set. Click 'Update Slide' to save!",
                                  });
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              const input = document.querySelector('input[placeholder*="Paste image URL"]') as HTMLInputElement;
                              const url = input?.value.trim();
                              if (url) {
                                setSlideForm({ ...slideForm, imageUrl: url });
                                toast({
                                  title: "Custom Image Added",
                                  description: "Your image URL has been set. Click 'Update Slide' to save!",
                                });
                                input.value = '';
                              }
                            }}
                          >
                            Use This URL
                          </Button>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          For online images: Imgur, Google Drive (public), or any direct image URL
                        </p>
                      </div>

                      <p className="pt-2">Or select from our image library:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { name: "Premium Rice", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=400&fit=crop&crop=center" },
                          { name: "Construction Steel", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop&crop=center" },
                          { name: "Office Paper", url: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=800&h=400&fit=crop&crop=center" },
                          { name: "Cooking Oil", url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=400&fit=crop&crop=center" },
                          { name: "Portland Cement", url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop&crop=center" },
                          { name: "Carib Beer", url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&h=400&fit=crop&crop=center" },
                          { name: "Office Supplies", url: "https://images.unsplash.com/photo-1531973968078-9bb02785f13d?w=800&h=400&fit=crop&crop=center" },
                          { name: "Fresh Vegetables", url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=400&fit=crop&crop=center" },
                          { name: "Electronics", url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=400&fit=crop&crop=center" },
                          { name: "Textile & Clothing", url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop&crop=center" },
                          { name: "Home Appliances", url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop&crop=center" },
                          { name: "Building Materials", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop&crop=center" }
                        ].map((image, idx) => (
                          <Button
                            key={idx}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-left justify-start p-2 h-auto"
                            onClick={() => {
                              setSlideForm({ ...slideForm, imageUrl: image.url });
                              toast({
                                title: "Image Selected",
                                description: `Selected ${image.name}. Click "Update Slide" to save!`,
                              });
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <img src={image.url} alt={image.name} className="w-8 h-8 object-cover rounded" />
                              <span>{image.name}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                      {editingSlideId && slideForm.imageUrl && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800 font-medium">
                            ⚠️ Image changed! Click "Update Slide" below to save your changes to the website.
                          </p>
                          <Button
                            type="button"
                            className="mt-2 bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              if (editingSlideId) {
                                updateSlideMutation.mutate({ id: editingSlideId, ...slideForm });
                              }
                            }}
                            disabled={updateSlideMutation.isPending}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Image Change Now
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="slideOrder">Display Order</Label>
                    <Input
                      id="slideOrder"
                      type="number"
                      value={slideForm.order}
                      onChange={(e) => setSlideForm({ ...slideForm, order: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={slideForm.isActive}
                    onCheckedChange={(checked) => setSlideForm({ ...slideForm, isActive: checked })}
                  />
                  <Label>Active (shown on website)</Label>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    disabled={createSlideMutation.isPending || updateSlideMutation.isPending}
                    className={editingSlideId ? "bg-green-600 hover:bg-green-700 text-white font-bold" : ""}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingSlideId ? "🔄 UPDATE SLIDE" : "➕ ADD SLIDE"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetSlideForm}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  {editingSlideId && (
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => {
                        resetSlideForm();
                        toast({
                          title: "Edit Cancelled",
                          description: "Returned to add mode",
                        });
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel Edit
                    </Button>
                  )}
                </div>
                {editingSlideId && (
                  <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg animate-pulse">
                    <p className="text-sm text-green-800 font-bold">
                      🔥 EDITING MODE ACTIVE - Slide #{editingSlideId}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Upload your image, change title/subtitle, then click the green "🔄 UPDATE SLIDE" button to save
                    </p>
                  </div>
                )}
              </form>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Current Carousel Slides</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Quick action to change all images at once
                      const imageUrls = [
                        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=400&fit=crop&crop=center",
                        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop&crop=center",
                        "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=800&h=400&fit=crop&crop=center",
                        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=400&fit=crop&crop=center",
                        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop&crop=center"
                      ];
                      
                      if (window.confirm("Replace all carousel images with fresh product photos?")) {
                        carouselSlides.forEach((slide: any, index: number) => {
                          if (index < imageUrls.length) {
                            updateSlideMutation.mutate({
                              id: slide.id,
                              title: slide.title,
                              subtitle: slide.subtitle || "",
                              imageUrl: imageUrls[index],
                              order: slide.order,
                              isActive: slide.isActive
                            });
                          }
                        });
                        
                        toast({
                          title: "Updating All Images",
                          description: "Replacing all carousel images with new photos...",
                        });
                      }
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Replace All Images
                  </Button>
                </div>
                {carouselLoading ? (
                  <div>Loading carousel slides...</div>
                ) : carouselSlides.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Carousel Slides</h3>
                    <p className="text-gray-600 mb-4">Add your first slide using the form above</p>
                    <Button 
                      onClick={() => {
                        setSlideForm({
                          title: "Your Product",
                          subtitle: "Add your product description",
                          imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=400&fit=crop&crop=center",
                          order: 1,
                          isActive: true
                        });
                        toast({
                          title: "Form Ready",
                          description: "Fill out the form above and click 'Add Slide'",
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Slide
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {carouselSlides.map((slide: CarouselSlide) => (
                      <div key={slide.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h5 className="font-medium">{slide.title}</h5>
                            <p className="text-sm text-gray-600">{slide.subtitle}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={slide.isActive ? "default" : "secondary"}>
                                {slide.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <span className="text-xs text-gray-500">Order: {slide.order}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              console.log('Edit button clicked for slide:', slide.id);
                              editSlide(slide);
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => {
                              console.log('Delete button clicked for slide:', slide.id);
                              if (window.confirm(`Delete slide "${slide.title}"?`)) {
                                deleteSlideMutation.mutate(slide.id);
                              }
                            }}
                            disabled={deleteSlideMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Management */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Product Catalog Management</span>
              </CardTitle>
              <CardDescription>
                Add, edit, and manage all products in your TGM storefront
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleProductSubmit} className="space-y-4 p-6 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="productSku">SKU *</Label>
                    <Input
                      id="productSku"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                      placeholder="e.g., RICE-001"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g., Premium Rice 25kg"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="productCategory">Category *</Label>
                    <Input
                      id="productCategory"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      placeholder="e.g., Food & Beverages"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="productPrice">Price (LRD) *</Label>
                    <Input
                      id="productPrice"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="e.g., 3500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="productStock">Stock Quantity *</Label>
                    <Input
                      id="productStock"
                      type="number"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm({ ...productForm, stockQuantity: parseInt(e.target.value) || 0 })}
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="productMinStock">Min Stock Level</Label>
                    <Input
                      id="productMinStock"
                      type="number"
                      value={productForm.minStockLevel}
                      onChange={(e) => setProductForm({ ...productForm, minStockLevel: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="productImage">Product Image</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id="productImage"
                          value={productForm.imageUrl}
                          onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                          placeholder="https://example.com/product-image.jpg"
                          className="flex-1"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="productImageUpload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                toast({
                                  title: "File Too Large",
                                  description: "Please select an image under 5MB",
                                  variant: "destructive",
                                });
                                return;
                              }
                              
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const dataUrl = event.target?.result as string;
                                setProductForm({ ...productForm, imageUrl: dataUrl });
                                toast({
                                  title: "Product Image Uploaded",
                                  description: "Image ready to save with product",
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('productImageUpload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                      {productForm.imageUrl && (
                        <div className="mt-2">
                          <img 
                            src={productForm.imageUrl} 
                            alt="Product preview" 
                            className="w-20 h-20 object-cover rounded border"
                          />
                        </div>
                      )}
                      
                      {/* Quick Image Library for Products */}
                      <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <Label className="text-sm font-medium text-purple-800">Quick Image Library:</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {[
                            { name: "Rice", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&crop=center" },
                            { name: "Steel", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center" }, 
                            { name: "Paper", url: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=400&h=300&fit=crop&crop=center" },
                            { name: "Oil", url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop&crop=center" },
                            { name: "Cement", url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center" },
                            { name: "Beer", url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop&crop=center" },
                            { name: "Office", url: "https://images.unsplash.com/photo-1497005367839-6e852de72767?w=400&h=300&fit=crop&crop=center" },
                            { name: "Tools", url: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop&crop=center" }
                          ].map((image, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setProductForm({ ...productForm, imageUrl: image.url })}
                              className="relative group"
                            >
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-12 h-12 object-cover rounded border-2 border-transparent group-hover:border-purple-500 transition-all"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded flex items-center justify-center transition-all">
                                <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                                  {image.name}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-purple-600 mt-2">
                          Click any image to use it for your product
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="productStatus">Status</Label>
                    <select
                      id="productStatus"
                      value={productForm.status}
                      onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="productDescription">Description</Label>
                  <Textarea
                    id="productDescription"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Detailed product description..."
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={productForm.isWholesale}
                      onCheckedChange={(checked) => setProductForm({ ...productForm, isWholesale: checked })}
                    />
                    <Label>Wholesale Product</Label>
                  </div>
                  {productForm.isWholesale && (
                    <div>
                      <Label htmlFor="wholesalePrice">Wholesale Price (LRD)</Label>
                      <Input
                        id="wholesalePrice"
                        value={productForm.wholeSalePrice}
                        onChange={(e) => setProductForm({ ...productForm, wholeSalePrice: e.target.value })}
                        placeholder="e.g., 3200"
                      />
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingProductId ? "Update Product" : "Add Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetProductForm}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </form>

              <div className="space-y-4">
                <h4 className="font-semibold">Current Products ({products.length})</h4>
                {productsLoading ? (
                  <div>Loading products...</div>
                ) : (
                  <div className="grid gap-4">
                    {products.map((product: Product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.imageUrl || "/api/placeholder/60/60"}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h5 className="font-medium">{product.name}</h5>
                            <p className="text-sm text-gray-600">{product.category} • {product.sku}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={product.status === "active" ? "default" : "secondary"}>
                                {product.status}
                              </Badge>
                              <span className="text-sm font-medium text-green-600">
                                LRD {parseFloat(product.price).toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500">
                                Stock: {product.stockQuantity}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => editProduct(product)}>
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => {
                              editProduct(product);
                              // Auto-scroll to image section
                              setTimeout(() => {
                                document.getElementById('productImage')?.scrollIntoView({ behavior: 'smooth' });
                              }, 100);
                              toast({
                                title: "Ready to Update Image",
                                description: "Product loaded! Upload new image or choose from library below.",
                              });
                            }}
                          >
                            <ImageIcon className="h-4 w-4" />
                            Update Image
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => deleteProductMutation.mutate(product.id)}
                            disabled={deleteProductMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Website Content Management */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Website Content Management</span>
              </CardTitle>
              <CardDescription>
                Update all text content across the entire TOTAG Group platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content Update Form */}
              <form onSubmit={handleContentSubmit} className="space-y-4 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Edit3 className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">
                    {editingContentId ? "Edit Website Content" : "Add New Content"}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contentSection">Section *</Label>
                    <select
                      id="contentSection"
                      value={contentForm.section}
                      onChange={(e) => setContentForm({ ...contentForm, section: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Section</option>
                      <option value="hero">Hero Section</option>
                      <option value="services">Services Section</option>
                      <option value="about">About Section</option>
                      <option value="contact">Contact Section</option>
                      <option value="footer">Footer</option>
                      <option value="general-merchandise">General Merchandise</option>
                      <option value="it-services">IT Services</option>
                      <option value="catering">Catering Services</option>
                      <option value="construction">Construction</option>
                      <option value="petroleum">Petroleum Services</option>
                      <option value="cargo">Cargo Handling</option>
                      <option value="farm">TOTAG Farm</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="contentKey">Content Key *</Label>
                    <Input
                      id="contentKey"
                      value={contentForm.key}
                      onChange={(e) => setContentForm({ ...contentForm, key: e.target.value })}
                      placeholder="e.g., main-title, description, button-text"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <select
                    id="contentType"
                    value={contentForm.type}
                    onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="html">HTML</option>
                    <option value="url">URL</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="contentValue">Content Value *</Label>
                  {contentForm.type === "html" ? (
                    <textarea
                      id="contentValue"
                      value={contentForm.value}
                      onChange={(e) => setContentForm({ ...contentForm, value: e.target.value })}
                      placeholder="Enter HTML content..."
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ) : (
                    <Input
                      id="contentValue"
                      value={contentForm.value}
                      onChange={(e) => setContentForm({ ...contentForm, value: e.target.value })}
                      placeholder="Enter content value..."
                      required
                    />
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    disabled={updateWebsiteContentMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {updateWebsiteContentMutation.isPending ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Updating...
                      </>
                    ) : editingContentId ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Content
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Content
                      </>
                    )}
                  </Button>
                  
                  {editingContentId && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={resetContentForm}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>

              {/* Website Content List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Current Website Content</h3>
                  <Badge variant="secondary">
                    {websiteContent.length} Content Items
                  </Badge>
                </div>
                
                {contentLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="ml-2">Loading website content...</span>
                  </div>
                ) : websiteContent.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Website Content</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first content item using the form above</p>
                    <Button 
                      onClick={() => {
                        setContentForm({
                          section: "hero",
                          key: "main-title",
                          value: "Welcome to TOTAG Group",
                          type: "text"
                        });
                        toast({
                          title: "Form Ready",
                          description: "Fill out the form above to add your first content item",
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Content
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Content by Section */}
                    {Object.entries(
                      websiteContent.reduce((sections: { [key: string]: WebsiteContent[] }, content: WebsiteContent) => {
                        if (!sections[content.section]) sections[content.section] = [];
                        sections[content.section].push(content);
                        return sections;
                      }, {} as { [key: string]: WebsiteContent[] })
                    ).map(([section, contents]) => {
                      const typedContents = contents as WebsiteContent[];
                      return (
                      <div key={section} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-lg text-gray-800 mb-3 capitalize border-b pb-2">
                          {section.replace('-', ' ')} Section
                        </h4>
                        <div className="space-y-2">
                          {typedContents.map((content: WebsiteContent) => (
                            <div 
                              key={content.id} 
                              className="flex items-center justify-between p-3 bg-gray-50 rounded border hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <Badge variant="outline" className="text-xs">
                                    {content.type}
                                  </Badge>
                                  <span className="font-medium text-gray-900">{content.key}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 truncate max-w-md">
                                  {content.value.length > 100 
                                    ? `${content.value.substring(0, 100)}...` 
                                    : content.value
                                  }
                                </p>
                                <span className="text-xs text-gray-400">
                                  Updated: {new Date(content.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => editContent(content)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit3 className="h-4 w-4" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Quick Content Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => {
                      setContentForm({
                        section: "hero",
                        key: "main-title",
                        value: "",
                        type: "text"
                      });
                      setActiveTab("content");
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Add Hero Title
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => {
                      setContentForm({
                        section: "services",
                        key: "section-description",
                        value: "",
                        type: "text"
                      });
                      setActiveTab("content");
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Add Service Info
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => {
                      setContentForm({
                        section: "contact",
                        key: "office-hours",
                        value: "",
                        type: "text"
                      });
                      setActiveTab("content");
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Add Contact Info
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}