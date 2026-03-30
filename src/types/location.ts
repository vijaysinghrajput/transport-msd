export interface State {
  id: string;
  name: string;
  code: string;
}

export interface District {
  id: string;
  name: string;
  state_id: string;
  state_name?: string;
}

export interface City {
  id: string;
  name: string;
  district_id: string;
  district_name?: string;
  state_id: string;
}

export interface Area {
  id: string;
  name: string;
  city_id: string;
  city_name?: string;
  pin_code: string;
}

export interface LocationData {
  state_id?: string;
  state_name?: string;
  district_id?: string;
  district_name?: string;
  city_id?: string;
  city_name?: string;
  area_id?: string;
  area_name?: string;
  pin_code?: string;
  address?: string;
}

export interface LocationMasterData {
  states: State[];
  districts: District[];
  cities: City[];
  areas: Area[];
}
