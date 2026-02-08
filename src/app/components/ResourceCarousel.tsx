import Slider from 'react-slick';
import { Check } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: string;
  price: number;
  category?: string;
  image: string;
  businessName?: string;
}

interface ResourceCarouselProps {
  title: string;
  icon: React.ReactNode;
  resources: Resource[];
  selectedResources: string[];
  onToggle: (id: string) => void;
  colorScheme?: 'blue' | 'orange' | 'purple';
}

export function ResourceCarousel({
  title,
  icon,
  resources,
  selectedResources,
  onToggle,
  colorScheme = 'blue'
}: ResourceCarouselProps) {
  const carouselSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const colorClasses = {
    blue: {
      border: 'border-gray-200',
      selectedBorder: 'border-[#003C66]',
      selectedBg: 'bg-blue-50',
      checkBg: 'bg-[#003C66]',
      price: 'text-[#003C66]'
    },
    orange: {
      border: 'border-gray-200',
      selectedBorder: 'border-[#FC8936]',
      selectedBg: 'bg-orange-50',
      checkBg: 'bg-[#FC8936]',
      price: 'text-[#FC8936]'
    },
    purple: {
      border: 'border-gray-200',
      selectedBorder: 'border-purple-500',
      selectedBg: 'bg-purple-50',
      checkBg: 'bg-purple-500',
      price: 'text-purple-600'
    }
  };

  const colors = colorClasses[colorScheme];

  if (resources.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
      <h5 className="font-semibold mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h5>
      <div className="carousel-container">
        <Slider {...carouselSettings}>
          {resources.map((item) => (
            <div key={item.id} className="px-2">
              <div
                onClick={() => onToggle(item.id)}
                className={`flex flex-col gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all h-full min-h-[180px] ${
                  selectedResources.includes(item.id)
                    ? `${colors.selectedBorder} ${colors.selectedBg}`
                    : `${colors.border} hover:border-gray-300`
                }`}
              >
                <div className="w-full h-24 rounded-lg overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                  {item.businessName && (
                    <p className="text-xs text-muted-foreground truncate">by {item.businessName}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{item.category || item.type}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`font-semibold text-sm ${colors.price}`}>${item.price}</p>
                  {selectedResources.includes(item.id) && (
                    <div className={`w-5 h-5 rounded-full ${colors.checkBg} flex items-center justify-center`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
