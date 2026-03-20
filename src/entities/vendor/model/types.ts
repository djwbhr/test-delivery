export type VendorImage = {
  url: string;
  url_lg: string;
};

export type Vendor = {
  id: number;
  rating: string;
  disabled_until: string | null;
  disabled_reason: string | null;
  general_info: {
    name: string;
  };
  image: VendorImage;
  logo: VendorImage;
};

export type VendorsFilterResponse = {
  data: Vendor[];
  total: number;
};
