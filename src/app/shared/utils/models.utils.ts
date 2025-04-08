export type HeroView = 'table-view' | 'card-view' | 'new' | 'edit';

export const HERO_TITLES: Record<HeroView, string> = {
  'table-view': 'Lista de héroes',
  'card-view': 'Vista de tarjetas',
  'new': 'Crear héroe',
  'edit': 'Editar héroe'
};