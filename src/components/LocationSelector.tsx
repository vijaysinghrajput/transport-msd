'use client';

import React, { useState, useEffect } from 'react';
import { Select, Form, Row, Col, Input } from 'antd';
import type { LocationData, State, District, City, Area } from '@/types/location';

const { Option } = Select;

interface LocationSelectorProps {
  value?: LocationData;
  onChange?: (value: LocationData) => void;
  disabled?: boolean;
}

// Mock data - replace with actual API calls
const mockStates: State[] = [
  { id: '1', name: 'Rajasthan', code: 'RJ' },
  { id: '2', name: 'Gujarat', code: 'GJ' },
  { id: '3', name: 'Maharashtra', code: 'MH' },
  { id: '4', name: 'Punjab', code: 'PB' },
  { id: '5', name: 'Haryana', code: 'HR' },
];

const mockDistricts: District[] = [
  // Rajasthan
  { id: '1', name: 'Jaipur', state_id: '1' },
  { id: '2', name: 'Jodhpur', state_id: '1' },
  { id: '3', name: 'Udaipur', state_id: '1' },
  // Gujarat
  { id: '4', name: 'Ahmedabad', state_id: '2' },
  { id: '5', name: 'Surat', state_id: '2' },
  { id: '6', name: 'Vadodara', state_id: '2' },
];

const mockCities: City[] = [
  // Jaipur
  { id: '1', name: 'Jaipur City', district_id: '1', state_id: '1' },
  { id: '2', name: 'Amber', district_id: '1', state_id: '1' },
  // Jodhpur  
  { id: '3', name: 'Jodhpur City', district_id: '2', state_id: '1' },
  // Ahmedabad
  { id: '4', name: 'Ahmedabad City', district_id: '4', state_id: '2' },
  { id: '5', name: 'Gandhinagar', district_id: '4', state_id: '2' },
];

const mockAreas: Area[] = [
  // Jaipur City
  { id: '1', name: 'Malviya Nagar', city_id: '1', pin_code: '302017' },
  { id: '2', name: 'Vaishali Nagar', city_id: '1', pin_code: '302021' },
  { id: '3', name: 'C-Scheme', city_id: '1', pin_code: '302001' },
  // Ahmedabad City
  { id: '4', name: 'Satellite', city_id: '4', pin_code: '380015' },
  { id: '5', name: 'Bopal', city_id: '4', pin_code: '380058' },
];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value = {},
  onChange,
  disabled = false
}) => {
  const [states] = useState<State[]>(mockStates);
  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  // Filter districts based on selected state
  useEffect(() => {
    if (value.state_id) {
      const filteredDistricts = mockDistricts.filter(d => d.state_id === value.state_id);
      setDistricts(filteredDistricts);
    } else {
      setDistricts([]);
      setCities([]);
      setAreas([]);
    }
  }, [value.state_id]);

  // Filter cities based on selected district
  useEffect(() => {
    if (value.district_id) {
      const filteredCities = mockCities.filter(c => c.district_id === value.district_id);
      setCities(filteredCities);
    } else {
      setCities([]);
      setAreas([]);
    }
  }, [value.district_id]);

  // Filter areas based on selected city
  useEffect(() => {
    if (value.city_id) {
      const filteredAreas = mockAreas.filter(a => a.city_id === value.city_id);
      setAreas(filteredAreas);
    } else {
      setAreas([]);
    }
  }, [value.city_id]);

  const handleStateChange = (stateId: string) => {
    const selectedState = states.find(s => s.id === stateId);
    const newValue: LocationData = {
      state_id: stateId,
      state_name: selectedState?.name,
      district_id: undefined,
      district_name: undefined,
      city_id: undefined,
      city_name: undefined,
      area_id: undefined,
      area_name: undefined,
      pin_code: undefined,
      address: value.address
    };
    onChange?.(newValue);
  };

  const handleDistrictChange = (districtId: string) => {
    const selectedDistrict = districts.find(d => d.id === districtId);
    const newValue: LocationData = {
      ...value,
      district_id: districtId,
      district_name: selectedDistrict?.name,
      city_id: undefined,
      city_name: undefined,
      area_id: undefined,
      area_name: undefined,
      pin_code: undefined
    };
    onChange?.(newValue);
  };

  const handleCityChange = (cityId: string) => {
    const selectedCity = cities.find(c => c.id === cityId);
    const newValue: LocationData = {
      ...value,
      city_id: cityId,
      city_name: selectedCity?.name,
      area_id: undefined,
      area_name: undefined,
      pin_code: undefined
    };
    onChange?.(newValue);
  };

  const handleAreaChange = (areaId: string) => {
    const selectedArea = areas.find(a => a.id === areaId);
    const newValue: LocationData = {
      ...value,
      area_id: areaId,
      area_name: selectedArea?.name,
      pin_code: selectedArea?.pin_code
    };
    onChange?.(newValue);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue: LocationData = {
      ...value,
      address: e.target.value
    };
    onChange?.(newValue);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="State" required>
            <Select
              placeholder="Select State"
              value={value.state_id}
              onChange={handleStateChange}
              disabled={disabled}
              showSearch
              filterOption={(input, option) =>
                option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
              }
            >
              {states.map(state => (
                <Option key={state.id} value={state.id}>
                  {state.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="District" required>
            <Select
              placeholder="Select District"
              value={value.district_id}
              onChange={handleDistrictChange}
              disabled={disabled || !value.state_id}
              showSearch
              filterOption={(input, option) =>
                option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
              }
            >
              {districts.map(district => (
                <Option key={district.id} value={district.id}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="City" required>
            <Select
              placeholder="Select City"
              value={value.city_id}
              onChange={handleCityChange}
              disabled={disabled || !value.district_id}
              showSearch
              filterOption={(input, option) =>
                option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
              }
            >
              {cities.map(city => (
                <Option key={city.id} value={city.id}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Area">
            <Select
              placeholder="Select Area"
              value={value.area_id}
              onChange={handleAreaChange}
              disabled={disabled || !value.city_id}
              showSearch
              allowClear
              filterOption={(input, option) =>
                option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
              }
            >
              {areas.map(area => (
                <Option key={area.id} value={area.id}>
                  {area.name} - {area.pin_code}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Pin Code" required>
            <Input
              placeholder="Pin Code"
              value={value.pin_code}
              onChange={(e) => onChange?.({ ...value, pin_code: e.target.value })}
              disabled={disabled}
              maxLength={6}
              pattern="[0-9]{6}"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Address" required>
            <Input.TextArea
              placeholder="Enter complete address"
              value={value.address}
              onChange={handleAddressChange}
              disabled={disabled}
              rows={3}
              maxLength={500}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default LocationSelector;
