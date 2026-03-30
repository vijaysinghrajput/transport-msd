import * as XLSX from 'xlsx'

// Indian state codes mapping
const STATE_CODES: { [key: string]: string } = {
  'Andhra Pradesh': 'AP',
  'Arunachal Pradesh': 'AR',
  'Assam': 'AS',
  'Bihar': 'BR',
  'Chhattisgarh': 'CG',
  'Goa': 'GA',
  'Gujarat': 'GJ',
  'Haryana': 'HR',
  'Himachal Pradesh': 'HP',
  'Jharkhand': 'JH',
  'Karnataka': 'KA',
  'Kerala': 'KL',
  'Madhya Pradesh': 'MP',
  'Maharashtra': 'MH',
  'Manipur': 'MN',
  'Meghalaya': 'ML',
  'Mizoram': 'MZ',
  'Nagaland': 'NL',
  'Odisha': 'OR',
  'Punjab': 'PB',
  'Rajasthan': 'RJ',
  'Sikkim': 'SK',
  'Tamil Nadu': 'TN',
  'Telangana': 'TG',
  'Tripura': 'TR',
  'Uttar Pradesh': 'UP',
  'Uttarakhand': 'UK',
  'West Bengal': 'WB',
  'Delhi': 'DL',
  'Jammu and Kashmir': 'JK',
  'Ladakh': 'LA',
  'Chandigarh': 'CH',
  'Puducherry': 'PY',
  'Andaman and Nicobar Islands': 'AN',
  'Dadra and Nagar Haveli and Daman and Diu': 'DN',
  'Lakshadweep': 'LD'
}

const getStateCode = (stateName: string): string => {
  return STATE_CODES[stateName] || stateName.substring(0, 2).toUpperCase()
}

export interface ExcelLocationData {
  locations: Array<{
    state: string
    code?: string
    district: string
    city: string
    area: string
    pincode: string
  }>
}

export const parseExcelFile = (file: File): Promise<ExcelLocationData> => {
  return new Promise((resolve, reject) => {
    console.log('Starting Excel file parsing...', { fileName: file.name, fileSize: file.size })
    
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        
        // Parse Locations sheet (single sheet with all data)
        let locationsSheet
        if (workbook.SheetNames.includes('Locations')) {
          locationsSheet = workbook.Sheets['Locations']
        } else {
          // If no 'Locations' sheet, use the first sheet
          locationsSheet = workbook.Sheets[workbook.SheetNames[0]]
        }
        
        const locationsData = XLSX.utils.sheet_to_json(locationsSheet)
        const locations = locationsData.map((row: any) => ({
          state: row['State'] || row['state'] || '',
          code: row['Code'] || row['code'] || '',
          district: row['District'] || row['district'] || '',
          city: row['City'] || row['city'] || '',
          area: row['Area'] || row['area'] || '',
          pincode: row['Pincode'] || row['pincode'] || ''
        }))
        
        console.log('Excel parsing successful!', { 
          totalRows: locationsData.length, 
          parsedLocations: locations.length,
          sampleLocation: locations[0] 
        })
        
        resolve({ locations })
      } catch (error) {
        console.error('Error parsing Excel file:', error)
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsBinaryString(file)
  })
}

export const generateExcelTemplate = (): void => {
  const workbook = XLSX.utils.book_new()
  
  // Single sheet with headers including Code column
  const locationData = [
    ['State', 'Code', 'District', 'City', 'Area', 'Pincode']
  ]
  
  const locationSheet = XLSX.utils.aoa_to_sheet(locationData)
  XLSX.utils.book_append_sheet(workbook, locationSheet, 'Locations')
  
  // Download the file
  XLSX.writeFile(workbook, 'Location_Template.xlsx')
}

export const validateExcelData = (data: ExcelLocationData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // Validate locations data
  if (data.locations) {
    data.locations.forEach((location, index) => {
      if (!location.state) {
        errors.push(`Row ${index + 2}: State is required`)
      }
      if (!location.code) {
        errors.push(`Row ${index + 2}: Code is required`)
      }
      if (!location.district) {
        errors.push(`Row ${index + 2}: District is required`)
      }
      if (!location.city) {
        errors.push(`Row ${index + 2}: City is required`)
      }
      if (!location.area) {
        errors.push(`Row ${index + 2}: Area is required`)
      }
      if (!location.pincode) {
        errors.push(`Row ${index + 2}: Pincode is required`)
      }
      if (location.pincode && !/^\d{6}$/.test(location.pincode)) {
        errors.push(`Row ${index + 2}: Pincode should be 6 digits`)
      }
      if (location.code && location.code.length !== 2) {
        errors.push(`Row ${index + 2}: Code should be 2 characters`)
      }
    })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
