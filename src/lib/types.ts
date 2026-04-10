export type Album = {
  id: number;
  title: string | null;
  description: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  cover_image_url: string | null;
  photos?: Photo[];
};

export type Photo = {
  id: number;
  caption: string | null;
  display_order: number;
  shot_at: string | null;
  image_url: string | null;
};
