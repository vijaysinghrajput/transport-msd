import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import dayjs from 'dayjs'
import { Quotation, ProductDetail } from '@/types/quotations'

export const generateProfessionalPDF = async (quotation: Quotation, productDetails: ProductDetail[]) => {
  // Create a temporary div for PDF content
  const tempDiv = document.createElement('div')
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.width = '800px'
  tempDiv.style.background = 'white'
  tempDiv.style.padding = '40px'
  tempDiv.innerHTML = generateDetailedQuotationHTML(quotation, productDetails)
  
  document.body.appendChild(tempDiv)

  try {
    // Create canvas from the content
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Download PDF
    pdf.save(`Quotation-${quotation.quotation_number}.pdf`)
  } finally {
    // Clean up
    document.body.removeChild(tempDiv)
  }
}

export const generateDetailedQuotationHTML = (quotation: Quotation, productDetails: ProductDetail[]): string => {
  const currentDate = new Date().toLocaleDateString('en-IN')
  const components = quotation.solar_systems?.components || []
  const vendor = quotation.vendors
  const lead = quotation.leads
  const user = quotation.users
  
  // Helper function to check if a value has real content
  const hasValue = (value: any): boolean => {
    return value !== null && value !== undefined && value !== '' && value !== 'N/A'
  }
  
  // Create product lookup map
  const productMap = productDetails.reduce((acc, product) => {
    acc[product.id] = product
    return acc
  }, {} as any)

  // Generate product breakdown table with enhanced details
  const productBreakdown = components.map((comp: any) => {
    const product = productMap[comp.product_id]
    const fallbackProduct = product || productDetails.find(p => p.id === comp.product_id)
    
    // Build tags array for product details
    const tags = []
    if (hasValue(fallbackProduct?.product_categories?.name)) {
      tags.push(`<span style="background: #e6f7ff; color: #0ea5e9; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">📂 ${fallbackProduct.product_categories.name}</span>`)
    }
    if (hasValue(fallbackProduct?.product_brands?.name)) {
      tags.push(`<span style="background: #f6ffed; color: #52c41a; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">🏷️ ${fallbackProduct.product_brands.name}</span>`)
    }
    if (hasValue(fallbackProduct?.warranty_period)) {
      tags.push(`<span style="background: #fff2e8; color: #fa8c16; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">🛡️ ${fallbackProduct.warranty_period}M Warranty</span>`)
    }
    if (hasValue(fallbackProduct?.sku)) {
      tags.push(`<span style="background: #f0f0f0; color: #666; padding: 2px 8px; border-radius: 12px; font-size: 11px;">SKU: ${fallbackProduct.sku}</span>`)
    }
    
    return `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #ddd; vertical-align: top;">
          <div style="margin-bottom: 8px;">
            <strong style="font-size: 16px; color: #333;">${fallbackProduct?.name || `Product ID: ${comp.product_id}` || 'Unknown Product'}</strong>
            ${hasValue(fallbackProduct?.sku) ? `<br><span style="color: #0ea5e9; font-weight: 500;">SKU: ${fallbackProduct.sku}</span>` : ''}
          </div>
          ${hasValue(fallbackProduct?.description) ? `<div style="color: #666; font-size: 13px; margin-bottom: 8px; line-height: 1.4;">${fallbackProduct.description}</div>` : ''}
          ${tags.length > 0 ? `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">${tags.join('')}</div>` : ''}
          ${hasValue(fallbackProduct?.specifications) ? `<div style="margin-top: 8px; font-size: 12px; color: #666;"><strong>Specs:</strong> ${fallbackProduct.specifications}</div>` : ''}
          ${hasValue(fallbackProduct?.technical_details) ? `<div style="margin-top: 4px; font-size: 12px; color: #666;"><strong>Technical:</strong> ${fallbackProduct.technical_details}</div>` : ''}
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #ddd; text-align: center; font-size: 16px; font-weight: 600;">${comp.quantity || 1}</td>
        <td style="padding: 15px; border-bottom: 1px solid #ddd; text-align: center; font-size: 14px;">${fallbackProduct?.unit || 'piece'}</td>
        <td style="padding: 15px; border-bottom: 1px solid #ddd; text-align: right; font-size: 15px; font-weight: 500;">${hasValue(comp.unit_price) ? `₹${comp.unit_price?.toLocaleString()}` : 'N/A'}</td>
        <td style="padding: 15px; border-bottom: 1px solid #ddd; text-align: right; font-size: 16px; font-weight: bold; color: #0ea5e9;">${hasValue(comp.total_price) ? `₹${comp.total_price?.toLocaleString()}` : 'N/A'}</td>
      </tr>
    `
  }).join('')

  // Generate vendor information dynamically
  const vendorInfo = vendor ? `
    <div style="background: #f0f9ff; padding: 25px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin-bottom: 30px;">
      <h3 style="color: #0ea5e9; margin: 0 0 20px 0; font-size: 18px;">🏢 Vendor Information</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div>
          ${hasValue(vendor?.company_name) ? `<div style="margin-bottom: 8px;"><strong>Company:</strong> ${vendor?.company_name}</div>` : ''}
          ${hasValue(vendor?.contact_person) ? `<div style="margin-bottom: 8px;"><strong>Contact Person:</strong> ${vendor?.contact_person}</div>` : ''}
          ${hasValue(vendor?.email) ? `<div style="margin-bottom: 8px;"><strong>Email:</strong> ${vendor?.email}</div>` : ''}
          ${hasValue(vendor?.phone) ? `<div style="margin-bottom: 8px;"><strong>Phone:</strong> ${vendor?.phone}</div>` : ''}
        </div>
        <div>
          ${hasValue(vendor?.gst_number) ? `<div style="margin-bottom: 8px;"><strong>GST No:</strong> ${vendor?.gst_number}</div>` : ''}
          ${hasValue(vendor?.pan_number) ? `<div style="margin-bottom: 8px;"><strong>PAN No:</strong> ${vendor?.pan_number}</div>` : ''}
          ${hasValue(vendor?.vendor_code) ? `<div style="margin-bottom: 8px;"><strong>Vendor Code:</strong> ${vendor?.vendor_code}</div>` : ''}
          ${hasValue(vendor?.registration_number) ? `<div style="margin-bottom: 8px;"><strong>Registration No:</strong> ${vendor?.registration_number}</div>` : ''}
        </div>
      </div>
      ${hasValue(vendor?.address) || hasValue(vendor?.city) || hasValue(vendor?.state) || hasValue(vendor?.pincode) ? `
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #d1ecf1;">
        <strong>Address:</strong><br>
        <span style="color: #666;">
          ${[
            hasValue(vendor?.address) ? vendor?.address : '',
            hasValue(vendor?.city) ? vendor?.city : '',
            hasValue(vendor?.state) ? vendor?.state : '',
            hasValue(vendor?.pincode) ? vendor?.pincode : ''
          ].filter(Boolean).join(', ')}
        </span>
      </div>
      ` : ''}
    </div>
  ` : ''

  // Generate customer address dynamically
  const customerAddress = lead?.address || quotation.customer_address
  const fullCustomerAddress = customerAddress ? 
    `${customerAddress}${lead?.city ? `, ${lead.city}` : ''}${lead?.state ? `, ${lead.state}` : ''}${lead?.pincode ? ` - ${lead.pincode}` : ''}` 
    : 'N/A'

  return `
    <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 3px solid #0ea5e9; padding-bottom: 30px; margin-bottom: 40px;">
        ${vendor?.logo_url ? `<img src="${vendor.logo_url}" alt="Company Logo" style="max-height: 80px; margin-bottom: 20px;">` : ''}
        <h1 style="color: #0ea5e9; font-size: 32px; margin: 0 0 10px 0; font-weight: bold;">
          ${vendor?.company_name?.toUpperCase() || 'SOLAR SOLUTIONS'}
        </h1>
        <p style="color: #666; font-size: 16px; margin: 0; line-height: 1.5;">
          Premium Solar Energy Solutions & Professional Installation Services<br>
          ${vendor?.email ? `📧 ${vendor.email}` : '📧 info@company.com'} | ${vendor?.phone ? `📞 ${vendor.phone}` : '📞 +91-XXXXXXXXXX'}
        </p>
      </div>

      ${vendorInfo}

      <!-- Quotation Title -->
      <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="font-size: 28px; color: #333; margin: 0; letter-spacing: 2px;">QUOTATION</h2>
        <div style="width: 100px; height: 3px; background: #0ea5e9; margin: 10px auto;"></div>
      </div>

      <!-- Quotation Details Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
        <!-- Left Column -->
        <div>
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
            <h3 style="color: #0ea5e9; margin: 0 0 20px 0; font-size: 18px;">📋 Quotation Details</h3>
            <div style="margin-bottom: 12px;">
              <strong>Quotation No:</strong> <span style="color: #0ea5e9; font-weight: bold;">${quotation.quotation_number}</span>
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Date:</strong> ${currentDate}
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Valid Until:</strong> <span style="color: #f5222d;">${dayjs(quotation.valid_until).format('DD MMM YYYY')}</span>
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Created By:</strong> ${user?.name || 'System'}
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
            <h3 style="color: #0ea5e9; margin: 0 0 20px 0; font-size: 18px;">👤 Customer Information</h3>
            <div style="margin-bottom: 12px;">
              <strong>Name:</strong> ${quotation.customer_name}
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Mobile:</strong> ${quotation.customer_phone || 'N/A'}
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Email:</strong> ${quotation.customer_email || 'N/A'}
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Address:</strong> ${fullCustomerAddress}
            </div>
          </div>
        </div>
      </div>

      <!-- System Information -->
      <div style="background: #f0f9ff; padding: 25px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin-bottom: 30px;">
        <h3 style="color: #0ea5e9; margin: 0 0 20px 0; font-size: 18px;">⚡ Solar System Specifications</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
          <div>
            <strong>System Name:</strong><br>
            <span style="color: #666;">${quotation.solar_systems?.name || 'Custom System'}</span>
          </div>
          <div>
            <strong>Capacity:</strong><br>
            <span style="color: #666; font-weight: bold;">${quotation.system_capacity_kw}kW</span>
          </div>
          <div>
            <strong>Application:</strong><br>
            <span style="color: #666;">${quotation.application_type}</span>
          </div>
          <div>
            <strong>System Type:</strong><br>
            <span style="color: #666;">${quotation.system_type}</span>
          </div>
        </div>
      </div>

      <!-- Product Breakdown -->
      ${productBreakdown.length > 0 ? `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #0ea5e9; margin: 0 0 20px 0; font-size: 20px;">🔧 Product Components & Specifications</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #0ea5e9; color: white;">
              <th style="padding: 15px; text-align: left; font-size: 14px; font-weight: bold;">Product Details</th>
              <th style="padding: 15px; text-align: center; font-size: 14px; font-weight: bold;">Qty</th>
              <th style="padding: 15px; text-align: center; font-size: 14px; font-weight: bold;">Unit</th>
              <th style="padding: 15px; text-align: right; font-size: 14px; font-weight: bold;">Unit Price</th>
              <th style="padding: 15px; text-align: right; font-size: 14px; font-weight: bold;">Total Price</th>
            </tr>
          </thead>
          <tbody>
            ${productBreakdown}
          </tbody>
        </table>
      </div>
      ` : ''}

      <!-- Cost Summary -->
      <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
        <h3 style="color: #0ea5e9; margin: 0 0 25px 0; font-size: 20px;">💰 Investment Summary</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div>
            <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 6px;">
              <strong style="color: #666;">Equipment Cost:</strong>
              <div style="font-size: 18px; font-weight: bold; color: #0ea5e9;">₹${quotation.raw_material_cost?.toLocaleString()}</div>
            </div>
          </div>
          <div>
            <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 6px;">
              <strong style="color: #666;">Installation Cost:</strong>
              <div style="font-size: 18px; font-weight: bold; color: #0ea5e9;">₹${quotation.installation_cost?.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        ${quotation.solar_systems?.additional_costs && quotation.solar_systems.additional_costs > 0 ? `
        <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px;">
          <strong style="color: #666;">Additional Costs:</strong>
          <div style="font-size: 18px; font-weight: bold; color: #0ea5e9;">₹${quotation.solar_systems.additional_costs.toLocaleString()}</div>
        </div>
        ` : ''}
        
        <div style="border-top: 3px solid #0ea5e9; padding-top: 20px; text-align: center;">
          <strong style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Total Investment Required</strong>
          <div style="font-size: 32px; font-weight: bold; color: #0ea5e9; margin-top: 8px;">
            ₹${quotation.net_amount?.toLocaleString()}
          </div>
        </div>
      </div>

      <!-- Terms and Conditions -->
      <div style="margin-top: 40px; padding: 25px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa;">
        <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">📄 Terms & Conditions</h3>
        <div style="font-size: 12px; line-height: 1.6; color: #666;">
          <p>• This quotation is valid until ${dayjs(quotation.valid_until).format('DD MMM YYYY')}.</p>
          <p>• All prices are inclusive of GST and installation charges as mentioned.</p>
          <p>• Warranty terms apply as per manufacturer specifications.</p>
          <p>• Site survey may be required before final installation.</p>
          <p>• Payment terms: As per mutual agreement.</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666; margin: 0;">
          Thank you for considering our solar solutions. For any queries, please contact us.
        </p>
        ${vendor?.signature_url ? `
        <div style="margin-top: 20px;">
          <img src="${vendor.signature_url}" alt="Signature" style="max-height: 60px;">
          <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Authorized Signature</p>
        </div>
        ` : ''}
      </div>
    </div>
  `
}

export const printQuotation = async (quotation: Quotation, productDetails: ProductDetail[]) => {
  const printContent = generateDetailedQuotationHTML(quotation, productDetails)
  const printWindow = window.open('', '_blank')
  
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quotation ${quotation.quotation_number}</title>
        <style>
          body { margin: 0; padding: 20px; }
          @media print { body { margin: 0; padding: 0; } }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}