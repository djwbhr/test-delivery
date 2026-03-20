export type HeroBannerMedia = {
  id: number;
  url: string;
  type: string;
};

export type HeroBanner = {
  id: number;
  title: string;
  sort: number;
  deeplink: string;
  button_text: string | null;
  erid: string | null;
  inn: string | null;
  legal_name: string | null;
  media: HeroBannerMedia;
};

export type HeroBannersResponse = HeroBanner[];
