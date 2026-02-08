import { PageHeader } from '@/app/components/PageHeader';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { CollectionsModal } from '@/app/components/CollectionsModal';

interface BusinessResourcesProps {
  onManageResources?: () => void;
  onAddResource?: () => void;
}

export function BusinessResources({ onManageResources, onAddResource }: BusinessResourcesProps) {
  const [activeTab, setActiveTab] = useState('facilities');
  const [showCollections, setShowCollections] = useState(false);

  // Mock data
  const facilities = [
    {
      id: 1,
      name: 'Downtown Sports Arena',
      type: 'Arena',
      location: '123 Main St',
      capacity: 500,
      pricePerHour: 150,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Westside Fitness Center',
      type: 'Gym',
      location: '456 West Ave',
      capacity: 200,
      pricePerHour: 75,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop'
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Pro Basketball',
      category: 'Basketball',
      price: 49.99,
      originalPrice: 69.99,
      inStock: true,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Running Shoes',
      category: 'Footwear',
      price: 129.99,
      inStock: true,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Yoga Mat Premium',
      category: 'Yoga',
      price: 39.99,
      originalPrice: 59.99,
      inStock: false,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop'
    }
  ];

  const services = [
    {
      id: 1,
      name: 'Personal Training',
      provider: 'Coach Mike Johnson',
      duration: '60 min',
      price: 80,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Nutrition Consultation',
      provider: 'Dr. Sarah Smith',
      duration: '45 min',
      price: 60,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <PageHeader
        title="Resources"
        subtitle="Manage facilities, products, and services"
        actions={
          <Button 
            onClick={onAddResource}
            className="bg-[#FC8936] hover:bg-[#E67A2F] gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Resource
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Facilities</p>
                <p className="text-2xl font-bold">{facilities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Wrench className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Services</p>
                <p className="text-2xl font-bold">{services.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        {/* Facilities Tab */}
        <TabsContent value="facilities" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Facilities
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Physical spaces and venues
                  </p>
                </div>
                <Badge variant="secondary">{facilities.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {facilities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {facilities.map((facility) => (
                    <div key={facility.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-40 bg-gray-200">
                        <img 
                          src={facility.image} 
                          alt={facility.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge 
                          variant="secondary"
                          className="absolute top-2 right-2"
                        >
                          {facility.type}
                        </Badge>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{facility.name}</h3>
                        
                        <div className="space-y-2 text-sm mb-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{facility.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>Capacity: {facility.capacity}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="w-3 h-3" />
                            <span>${facility.pricePerHour}/hr</span>
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full">
                          Edit Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No facilities yet</p>
                  <Button onClick={onAddResource} className="bg-[#FC8936] hover:bg-[#E67A2F]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Facility
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Products
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Equipment and gear for sale
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCollections(true)}
                    className="gap-2"
                  >
                    <Folder className="w-4 h-4" />
                    Manage Collections
                  </Button>
                  <Badge variant="secondary">{products.length}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <Slider
                  dots={false}
                  infinite={false}
                  speed={500}
                  slidesToShow={3}
                  slidesToScroll={1}
                  arrows={true}
                  nextArrow={<CustomNextArrow />}
                  prevArrow={<CustomPrevArrow />}
                  responsive={[
                    {
                      breakpoint: 1024,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                      }
                    },
                    {
                      breakpoint: 768,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                      }
                    }
                  ]}
                >
                  {products.map((product) => (
                    <div key={product.id} className="px-2">
                      <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-48 bg-gray-200">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <Badge 
                            variant={product.inStock ? 'default' : 'secondary'}
                            className={`absolute top-2 right-2 ${product.inStock ? 'bg-green-500' : ''}`}
                          >
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold mb-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-lg font-bold">${product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-400 line-through ml-2">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                            {product.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{product.rating}</span>
                              </div>
                            )}
                          </div>

                          <Button variant="outline" size="sm" className="w-full">
                            Edit Product
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No products yet</p>
                  <Button onClick={onAddResource} className="bg-[#FC8936] hover:bg-[#E67A2F]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Services
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Professional services and coaching
                  </p>
                </div>
                <Badge variant="secondary">{services.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-40 bg-gray-200">
                        <img 
                          src={service.image} 
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{service.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{service.provider}</p>
                        
                        <div className="space-y-2 text-sm mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Duration:</span>
                            <span className="font-medium">{service.duration}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Price:</span>
                            <span className="font-medium">${service.price}</span>
                          </div>
                          {service.rating && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Rating:</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{service.rating}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <Button variant="outline" size="sm" className="w-full">
                          Edit Service
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No services yet</p>
                  <Button onClick={onAddResource} className="bg-[#FC8936] hover:bg-[#E67A2F]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Service
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Collections Modal */}
      <CollectionsModal open={showCollections} onClose={() => setShowCollections(false)} />
    </div>
  );
}

function CustomNextArrow({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="absolute top-0 right-0 bottom-0 z-10 flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <ChevronRight className="w-6 h-6 text-gray-500" />
    </div>
  );
}

function CustomPrevArrow({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="absolute top-0 left-0 bottom-0 z-10 flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <ChevronLeft className="w-6 h-6 text-gray-500" />
    </div>
  );
}