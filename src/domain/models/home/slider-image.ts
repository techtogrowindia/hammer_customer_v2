/** A home-screen banner, managed from the admin panel. */
export interface SliderImage {
  id: number;
  image: string | null;
  tag: string;
  title: string;
  subtitle: string;
  link_url: string;
}

export interface GetSliderImagesResponse {
  success: boolean;
  message: string;
  data: SliderImage[];
}
